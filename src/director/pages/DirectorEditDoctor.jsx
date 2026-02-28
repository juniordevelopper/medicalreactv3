import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './DirectorEditDoctor.module.css';
import { MdArrowBack, MdSave, MdDeleteOutline, MdInfoOutline } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';

const DirectorEditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    department: '',
    room_number: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, deptRes] = await Promise.all([
          axios.get(`director/manage-doctors/${id}/`),
          axios.get('departments/').catch(() => ({ data: [] }))
        ]);

        setDoctorInfo(docRes.data);
        setDepartments(deptRes.data);
        setFormData({
          department: docRes.data.department,
          room_number: docRes.data.room_number || ''
        });
      } catch (err) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // TAHRIRLASHNI SAQLASH
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`director/manage-doctors/${id}/`, formData);
      toast.success("Muvaffaqiyatli yangilandi!");
      setTimeout(() => navigate(`/director/doctor-detail/${id}`), 1500);
    } catch (err) {
      toast.error("Saqlashda xatolik yuz berdi!");
    }
  };

  // SHIFOKORNI LAVOZIMIDAN OZOD QILISH (DELETE)
  const handleDelete = async () => {
    try {
      await axios.delete(`director/manage-doctors/${id}/`);
      toast.warn("Shifokor lavozimidan ozod qilindi!");
      setTimeout(() => navigate('/director/manage-doctors'), 1500);
    } catch (err) {
      toast.error("O'chirishda xatolik yuz berdi!");
    }
  };

  if (loading) return <div className={styles.container}>Yuklanmoqda...</div>;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <MdArrowBack size={22} />
          </button>
          <h2>Shifokor sozlamalari</h2>
        </div>

        {doctorInfo && (
          <div className={styles.doctorBrief}>
            <div className={styles.briefInfo}>
              <h4>{doctorInfo.user_details.full_name}</h4>
              <p>{doctorInfo.user_details.phone} | {doctorInfo.user_details.email}</p>
            </div>
            <span className={styles.statusBadge}>Ayni vaqtda: {doctorInfo.department_name}</span>
          </div>
        )}

        {/* TAHRIRLASH FORMASI */}
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Bo'limni o'zgartirish</label>
            <select 
              className={styles.select}
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
            >
              <option value="">Bo'limni tanlang</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Xona raqami</label>
            <input
              type="number"
              className={styles.input}
              value={formData.room_number}
              onChange={(e) => setFormData({...formData, room_number: e.target.value})}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>
              <MdSave /> Saqlash
            </button>
          </div>
        </form>

        {/* XAVFLI HUDUD: O'CHIRISH */}
        <div className={styles.dangerZone}>
          <div className={styles.dangerHeader}>
            <MdInfoOutline size={20} />
            <h3>Xavfli hudud</h3>
          </div>
          <p>Shifokorni lavozimidan ozod qilsangiz, uning barcha biriktirilgan ma'lumotlari o'chiriladi va roli qaytadan "Bemor" (Patient) holatiga qaytadi.</p>
          
          {!showDeleteConfirm ? (
            <button 
              type="button" 
              className={styles.deleteBtn} 
              onClick={() => setShowDeleteConfirm(true)}
            >
              <MdDeleteOutline /> Lavozimidan ozod qilish
            </button>
          ) : (
            <div className={styles.confirmBox}>
              <span>Ishonchingiz komilmi?</span>
              <div className={styles.confirmBtns}>
                <button onClick={handleDelete} className={styles.confirmYes}>Ha, o'chirilsin</button>
                <button onClick={() => setShowDeleteConfirm(false)} className={styles.confirmNo}>Bekor qilish</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorEditDoctor;
