import { useState, useEffect } from 'react';
import { usePatient } from '../components/PatientContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiCamera, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiDroplet } from 'react-icons/fi';
import styles from './PatientProfile.module.css';

const PatientProfile = () => {
  const { patient, refreshProfile } = usePatient();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    birth_date: '',
    gender: '',
    blood_group: '', // Yangi maydon
    address: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (patient) {
      setFormData({
        full_name: patient.full_name || '',
        phone_number: patient.phone_number || '',
        birth_date: patient.birth_date || '',
        gender: patient.gender || '',
        blood_group: patient.blood_group || '',
        address: patient.address || ''
      });
      setPreview(patient.avatar);
    }
  }, [patient, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    
    // Oddiy maydonlarni qo'shish
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    // FAYLNI QO'SHISH (MUHIM QISM)
    if (selectedFile) {
      // selectedFile - bu e.target.files[0] bo'lishi kerak
      data.append('avatar', selectedFile); 
    }

    try {
      await axiosInstance.patch('patient/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Profil yangilandi!");
      refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Rasm yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shaxsiy ma'lumotlar</h2>
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

      <form onSubmit={handleSubmit} className={styles.profileBox}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <img src={preview || '/default-avatar.png'} alt="Avatar" className={styles.avatarImg} />
            {isEditing && (
              <label className={styles.uploadBtn}>
                <FiCamera />
                <input type="file" hidden onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }} accept="image/*" />
              </label>
            )}
          </div>
          <div className={styles.headerText}>
            <h3>{patient?.full_name}</h3>
            <p className={styles.bloodType}>Qon guruhi: {patient?.blood_group || 'Noma\'lum'}</p>
          </div>
        </div>

        <div className={styles.formGrid}>
          {/* Ism va Email (Oldingidek) */}
          <div className={styles.inputGroup}>
            <label><FiUser /> To'liq ism</label>
            <input name="full_name" type="text" value={formData.full_name} disabled={!isEditing} onChange={handleInputChange} />
          </div>

          <div className={styles.inputGroup}>
            <label><FiDroplet /> Qon guruhi</label>
            <select name="blood_group" value={formData.blood_group} disabled={!isEditing} onChange={handleInputChange}>
              <option value="">Tanlang</option>
              <option value="I+">I (0) Rh+</option>
              <option value="I-">I (0) Rh-</option>
              <option value="II+">II (A) Rh+</option>
              <option value="II-">II (A) Rh-</option>
              <option value="III+">III (B) Rh+</option>
              <option value="III-">III (B) Rh-</option>
              <option value="IV+">IV (AB) Rh+</option>
              <option value="IV-">IV (AB) Rh-</option>
            </select>
          </div>

          {/* Qolgan maydonlar (Phone, Date, Gender, Address) */}
          <div className={styles.inputGroup}>
            <label><FiPhone /> Telefon</label>
            <input name="phone_number" type="text" value={formData.phone_number} disabled={!isEditing} onChange={handleInputChange} />
          </div>

          <div className={styles.inputGroup}>
            <label><FiCalendar /> Tug'ilgan sana</label>
            <input name="birth_date" type="date" value={formData.birth_date} disabled={!isEditing} onChange={handleInputChange} />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label><FiMapPin /> Manzil</label>
            <textarea name="address" rows="2" value={formData.address} disabled={!isEditing} onChange={handleInputChange} />
          </div>
        </div>

        {isEditing && (
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Saqlanmoqda..." : <><FiSave /> Saqlash</>}
          </button>
        )}
      </form>
    </div>
  );
};

export default PatientProfile;
