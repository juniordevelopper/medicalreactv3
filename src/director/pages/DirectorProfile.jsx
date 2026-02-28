import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import styles from './DirectorProfile.module.css';
import { PatternFormat } from 'react-number-format';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DirectorProfile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('director/profile/');
      setUserData(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Telefonni tozalash: +998 (90) 123-45-67 -> +998901234567 (13 belgi)
    const cleanPhone = formData.phone_number ? formData.phone_number.replace(/[^\d+]/g, '') : '';

    data.append('full_name', formData.full_name || '');
    data.append('phone_number', cleanPhone);
    data.append('birth_date', formData.birth_date || '');
    data.append('gender', formData.gender || 'male');
    data.append('address', formData.address || '');
    
    if (formData.avatar instanceof File) {
      data.append('avatar', formData.avatar);
    }

    try {
      const res = await axios.patch('director/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUserData(res.data);
      setIsEditing(false);
      setImagePreview(null);
      toast.success("Profil yangilandi! 🎉");
    } catch (err) {
      const errorMsg = err.response?.data?.phone_number || "Saqlashda xatolik yuz berdi.";
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    }
  };

  if (loading) return <div className={styles.profileWrapper}>Yuklanmoqda...</div>;

  const getInitial = () => userData?.full_name ? userData.full_name.charAt(0).toUpperCase() : '?';

  return (
    <div className={styles.profileWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            {imagePreview ? (
              <img src={imagePreview} className={styles.previewImg} alt="Preview" />
            ) : userData?.avatar ? (
              <img src={userData.avatar} className={styles.profileImg} alt="Avatar" />
            ) : (
              <div className={styles.initialsAvatar}>{getInitial()}</div>
            )}
            
            {isEditing && (
              <label className={styles.cameraIcon}>
                📷
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>
          <div className={styles.headerInfo}>
            <h1>{userData?.full_name}</h1>
            <span className={styles.badge}>{userData?.role}</span>
          </div>
        </div>

        <div className={styles.contentBody}>
          {!isEditing ? (
            <>
              <h3 className={styles.sectionTitle}>Tizim Ma'lumotlari</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}><label>ID</label><div className={styles.infoValue}>{userData?.id}</div></div>
                <div className={styles.infoItem}><label>Username</label><div className={styles.infoValue}>{userData?.username}</div></div>
                <div className={styles.infoItem}><label>Email</label><div className={styles.infoValue}>{userData?.email}</div></div>
                <div className={styles.infoItem}><label>Rol</label><div className={styles.infoValue}>{userData?.role}</div></div>
              </div>

              <h3 className={styles.sectionTitle}>Shaxsiy Ma'lumotlar</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}><label>F.I.SH</label><div className={styles.infoValue}>{userData?.full_name}</div></div>
                <div className={styles.infoItem}><label>Telefon</label><div className={styles.infoValue}>{userData?.phone_number || '---'}</div></div>
                <div className={styles.infoItem}><label>Tug'ilgan sana</label><div className={styles.infoValue}>{userData?.birth_date || '---'}</div></div>
                <div className={styles.infoItem}><label>Jins</label><div className={styles.infoValue}>{userData?.gender === 'male' ? 'Erkak' : 'Ayol'}</div></div>
                <div className={`${styles.infoItem} ${styles.fullWidth}`}><label>Manzil</label><div className={styles.infoValue}>{userData?.address || '---'}</div></div>
              </div>
              <div className={styles.actions}>
                <button onClick={() => setIsEditing(true)} className={styles.btnEdit}>Profilni tahrirlash</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <h3 className={styles.sectionTitle}>Tahrirlash rejimi</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>To'liq Ism (F.I.SH)</label>
                  <input name="full_name" value={formData.full_name || ''} onChange={handleChange} className={styles.inputField} required />
                </div>
                <div className={styles.infoItem}>
                  <label>Telefon</label>
                  <PatternFormat
                    format="+998 (##) ###-##-##"
                    mask="_"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    className={styles.inputField}
                    onValueChange={(values) => {
                      setFormData(prev => ({ ...prev, phone_number: values.formattedValue }));
                    }}
                  />
                </div>
                <div className={styles.infoItem}>
                  <label>Tug'ilgan sana</label>
                  <input type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.infoItem}>
                  <label>Jins</label>
                  <select name="gender" value={formData.gender || 'male'} onChange={handleChange} className={styles.inputField}>
                    <option value="male">Erkak</option>
                    <option value="female">Ayol</option>
                  </select>
                </div>
                <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                  <label>Manzil</label>
                  <textarea name="address" value={formData.address || ''} onChange={handleChange} className={styles.inputField} rows="3" />
                </div>
              </div>
              <div className={styles.actions}>
                <button type="submit" className={styles.btnSave}>Saqlash</button>
                <button type="button" onClick={() => { setIsEditing(false); setImagePreview(null); }} className={styles.btnCancel}>Bekor qilish</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorProfile;
