import React, { useState, useEffect } from 'react';
import { useDoctor } from '../components/DoctorContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast'; 
import { FiEdit2, FiSave, FiX, FiCamera, FiUser, FiMail, FiBriefcase, FiMapPin } from 'react-icons/fi';
import styles from './DoctorProfile.module.css';

const DoctorProfile = () => {
  const { doctor, refreshProfile, loading: contextLoading } = useDoctor();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ experience_years: 0, bio: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ma'lumotlarni formaga yuklash
  useEffect(() => {
    if (doctor) {
      setFormData({
        experience_years: doctor.experience_years || 0,
        bio: doctor.bio || ''
      });
      setPreview(doctor.avatar);
    }
  }, [doctor, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('experience_years', formData.experience_years);
    data.append('bio', formData.bio);
    
    if (selectedFile) {
      data.append('avatar', selectedFile); 
    }

    try {
      await axiosInstance.patch('doctor/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await refreshProfile(); // Contextni yangilash
      setIsEditing(false);
      toast.success("Profil muvaffaqiyatli yangilandi!", { duration: 3000 });
    } catch (err) {
      const errorMsg = err.response?.data?.avatar?.[0] || "Saqlashda xatolik yuz berdi!";
      toast.error(errorMsg, { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) return <div className={styles.loader}>Yuklanmoqda...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.headerArea}>
        <h2 className={styles.pageTitle}>Shaxsiy profil</h2>
        {!isEditing ? (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            <FiEdit2 /> Tahrirlash
          </button>
        ) : (
          <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
            <FiX /> Bekor qilish
          </button>
        )}
      </div>

      <div className={styles.mainCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {preview ? (
              <img src={preview} alt="Avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}><FiUser /></div>
            )}
            {isEditing && (
              <label className={styles.cameraBtn}>
                <FiCamera />
                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
          <div className={styles.titleInfo}>
            <h3>{doctor?.full_name}</h3>
            <span className={styles.deptBadge}>{doctor?.department_name}</span>
            <p><FiMapPin /> {doctor?.hospital_name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.detailsForm}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label><FiMail /> Email</label>
              <input type="text" value={doctor?.email || ''} disabled className={styles.lockedInput} />
            </div>

            <div className={styles.inputGroup}>
              <label><FiBriefcase /> Ish tajribasi (yil)</label>
              <input 
                type="number" min={0}
                value={formData.experience_years} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                className={isEditing ? styles.editableInput : styles.lockedInput}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Biografiya va Mutaxassislik haqida</label>
              <textarea 
                rows="5"
                value={formData.bio} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className={isEditing ? styles.editableTextarea : styles.lockedTextarea}
                placeholder="Ma'lumot kiritilmagan..."
              />
            </div>
          </div>

          {isEditing && (
            <div className={styles.footerActions}>
              <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading ? "Saqlanmoqda..." : <><FiSave /> O'zgarishlarni saqlash</>}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
