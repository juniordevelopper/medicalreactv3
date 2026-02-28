import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './DirectorDoctorDetail.module.css';
import { MdArrowBack, MdEmail, MdPhone, MdLocationOn, MdWork, MdEdit } from 'react-icons/md';

const DirectorDoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`director/manage-doctors/${id}/`);
        setDoctor(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className={styles.loading}>Yuklanmoqda...</div>;
  if (!doctor) return <div className={styles.error}>Ma'lumot topilmadi.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <MdArrowBack /> Orqaga
          </button>
          
          {/* TAHRIRLASH TUGMASI */}
          <button 
            className={styles.editBtn} 
            onClick={() => navigate(`/director/edit-doctor/${id}`)}
          >
            <MdEdit /> Tahrirlash
          </button>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.mainInfo}>
            <div className={styles.avatarLarge}>
              {doctor.user_details.full_name?.charAt(0)}
            </div>
            <div className={styles.nameGroup}>
              <h1>{doctor.user_details.full_name}</h1>
              <span className={styles.deptBadge}>{doctor.department_name}</span>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <MdEmail className={styles.icon} />
              <div><label>Email</label><p>{doctor.user_details.email}</p></div>
            </div>
            <div className={styles.detailItem}>
              <MdPhone className={styles.icon} />
              <div><label>Telefon</label><p>{doctor.user_details.phone}</p></div>
            </div>
            <div className={styles.detailItem}>
              <MdWork className={styles.icon} />
              <div><label>Tajriba</label><p>{doctor.experience_years || 0} yil</p></div>
            </div>
            <div className={styles.detailItem}>
              <MdLocationOn className={styles.icon} />
              <div><label>Xona raqami</label><p>{doctor.room_number || '---'}</p></div>
            </div>
          </div>

          <div className={styles.bioSection}>
            <h3>Biografiya</h3>
            <p>{doctor.bio || "Ma'lumot kiritilmagan."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDoctorDetail;
