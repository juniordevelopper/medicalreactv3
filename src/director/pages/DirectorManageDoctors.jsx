import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import styles from './DirectorManageDoctors.module.css';
import { MdPersonAdd, MdSearch, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const DirectorManageDoctors = () => {
  const [allDoctors, setAllDoctors] = useState([]); // Original to'liq ro'yxat
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Filterlangan ro'yxat
  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter holatlari
  const [deptFilter, setDeptFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  // 1. Ma'lumotlarni bir marta yuklab olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('director/manage-doctors/');
        setAllDoctors(res.data);
        setFilteredDoctors(res.data); // Dastlab hamma shifokorlarni ko'rsatamiz

        // Bo'limlarni ajratib olish
        const depts = res.data.map(d => ({ id: d.department, name: d.department_name }));
        const uniqueDepts = Array.from(new Set(depts.map(a => a.id)))
          .map(id => depts.find(a => a.id === id));
        setUniqueDepartments(uniqueDepts);
      } catch (err) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. React orqali Filterlash mantiqi (Real vaqtda)
  useEffect(() => {
    let result = allDoctors;

    // Bo'lim bo'yicha filter
    if (deptFilter) {
      result = result.filter(doc => doc.department === parseInt(deptFilter));
    }

    // Ism, Telefon yoki Email bo'yicha filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(doc => 
        (doc.user_details.full_name || "").toLowerCase().includes(search) ||
        (doc.user_details.phone || "").includes(search) ||
        (doc.user_details.email || "").toLowerCase().includes(search)
      );
    }

    setFilteredDoctors(result);
  }, [deptFilter, searchTerm, allDoctors]);

  if (loading) return <div className={styles.loading}>Yuklanmoqda...</div>;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className={styles.headerCard}>
        <div className={styles.titleRow}>
          <h2>Shifokorlar Boshqaruvi</h2>
          <button className={styles.btnAdd} onClick={() => navigate('/director/create-doctor')}>
            <MdPersonAdd size={20} /> Yangi Tayinlash
          </button>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.searchGroup}>
            <div className={styles.inputWrapper}>
              <MdSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Ism, telefon yoki email orqali real vaqtda izlash..." 
                className={styles.input} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Har bir harfda filter ishlaydi
              />
            </div>
            
            <select 
              className={styles.select} 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">Barcha Bo'limlar</option>
              {uniqueDepartments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>F.I.SH</th>
              <th>Bo'lim</th>
              <th>Xona</th>
              <th>Telefon</th>
              <th style={{textAlign: 'center'}}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
              <tr key={doc.id}>
                <td className={styles.userCell}>
                  <div className={styles.avatar}>{doc.user_details.full_name?.charAt(0)}</div>
                  <div className={styles.userName}>
                    <strong>{doc.user_details.full_name}</strong>
                    <span>{doc.user_details.email}</span>
                  </div>
                </td>
                <td>{doc.department_name}</td>
                <td><span className={styles.roomBadge}>{doc.room_number || '---'}</span></td>
                <td>{doc.user_details.phone}</td>
                <td style={{textAlign: 'center'}}>
                  <button 
                    className={styles.btnView} 
                    onClick={() => navigate(`/director/doctor-detail/${doc.id}`)}
                  >
                    <MdVisibility />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className={styles.noData}>Natija topilmadi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DirectorManageDoctors;
