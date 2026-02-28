import React, { useState, useEffect } from 'react';
import { useReception } from '../components/ReceptionContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiPower, FiUser, FiHome, FiClock, FiActivity } from 'react-icons/fi';
import styles from './ReceptionProfile.module.css';

const ReceptionProfile = () => {
  const { reception, refreshProfile } = useReception();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ shift_info: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reception) {
      setFormData({ shift_info: reception.shift_info || '' });
    }
  }, [reception, isEditing]);

  // Smenani boshlash yoki tugatish (toggle_status)
  const handleToggleStatus = async () => {
    try {
      const res = await axiosInstance.post('reception/profile/toggle_status/');
      toast.success(res.data.status);
      refreshProfile();
    } catch (err) {
      toast.error("Smenani o'zgartirib bo'lmadi");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.patch('reception/profile/', formData);
      toast.success("Profil yangilandi!");
      refreshProfile();
      setIsEditing(false);
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.titleBox}>
          <h2>Registrator Profili</h2>
          <span className={`${styles.statusBadge} ${reception?.is_online ? styles.online : styles.offline}`}>
            {reception?.is_online ? "Smenada" : "Oflayn"}
          </span>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={`${styles.toggleBtn} ${reception?.is_online ? styles.btnRed : styles.btnGreen}`}
            onClick={handleToggleStatus}
          >
            <FiPower /> {reception?.is_online ? "Smenani tugatish" : "Smenani boshlash"}
          </button>
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
      </div>

      <div className={styles.profileGrid}>
        {/* Chap tomon: Asosiy info */}
        <div className={styles.infoCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarCircle}>
              <FiUser />
            </div>
            <h3>{reception?.full_name}</h3>
            <p>ID: #R-{reception?.id}</p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <FiActivity />
              <span>Holat: <strong>{reception?.is_available ? "Bo'sh" : "Band"}</strong></span>
            </div>
            <div className={styles.statItem}>
              <FiHome />
              <span>Shifoxona: <strong>{reception?.hospital_name}</strong></span>
            </div>
          </div>
        </div>

        {/* O'ng tomon: Forma */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.inputGroup}>
            <label><FiUser /> To'liq ism</label>
            <input type="text" value={reception?.full_name || ''} disabled />
          </div>

          <div className={styles.inputGroup}>
            <label><FiHome /> Shifoxona</label>
            <input type="text" value={reception?.hospital_name || ''} disabled />
          </div>

          <div className={styles.inputGroup}>
            <label><FiClock /> Smena ma'lumoti (Shift Info)</label>
            <input 
              type="text" 
              placeholder="Masalan: 08:00 - 17:00 (A-smena)"
              value={formData.shift_info}
              onChange={(e) => setFormData({...formData, shift_info: e.target.value})}
              disabled={!isEditing}
              className={isEditing ? styles.editable : ''}
            />
          </div>

          {isEditing && (
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              <FiSave /> {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReceptionProfile;
