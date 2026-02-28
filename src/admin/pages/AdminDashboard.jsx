import React, { useState, useEffect } from 'react';
import { 
  MdLocalHospital, MdPeople, MdPersonAddAlt1, 
  MdDeleteSweep, MdArrowForward 
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './admindashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    hospitals: 0,
    doctors: 0,
    patients: 0,
    deleteRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Bu yerda backenddan real statistika keladi
        // Hozircha test ma'lumotlari:
        setStats({
          hospitals: 12,
          doctors: 45,
          patients: 1200,
          deleteRequests: 3
        });
      } catch (error) {
        console.error("Statistika yuklanmadi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { id: 1, title: 'Shifoxonalar', value: stats.hospitals, icon: <MdLocalHospital />, color: '#2563eb', path: '/admin/hospitals' },
    { id: 2, title: 'Shifokorlar', value: stats.doctors, icon: <MdPeople />, color: '#10b981', path: '/admin/users' },
    { id: 3, title: 'Bemorlar', value: stats.patients, icon: <MdPersonAddAlt1 />, color: '#f59e0b', path: '/admin/users' },
    { id: 4, title: "O'chirish so'rovlari", value: stats.deleteRequests, icon: <MdDeleteSweep />, color: '#ef4444', path: '/admin/delete-requests' },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Tizim statistikasi</h1>
        <p>Xush kelibsiz! Bugungi holat bilan tanishing.</p>
      </header>

      {/* STATS GRID */}
      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <div 
            key={card.id} 
            className={styles.card} 
            onClick={() => navigate(card.path)}
            style={{ '--card-color': card.color }}
          >
            <div className={styles.cardInfo}>
              <span className={styles.cardTitle}>{card.title}</span>
              <h2 className={styles.cardValue}>{loading ? '...' : card.value}</h2>
            </div>
            <div className={styles.cardIcon} style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className={styles.cardArrow}>
              <MdArrowForward />
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITIES / QUICK INFO */}
      <div className={styles.bottomGrid}>
        <div className={styles.activityBox}>
          <h3>Tizim holati</h3>
          <div className={styles.statusItem}>
            <span>Server holati:</span>
            <span className={styles.statusOnline}>Onlayn</span>
          </div>
          <div className={styles.statusItem}>
            <span>Oxirgi yangilanish:</span>
            <span>Hozirgina</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <h3>Tezkor amallar</h3>
          <button onClick={() => navigate('/admin/hospitals')} className={styles.quickBtn}>
            Yangi shifoxona qo'shish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
