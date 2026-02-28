import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdWarning } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './adminregions.module.css';

const AdminRegions = () => {
  const [regions, setRegions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const fetchRegions = async () => {
    try {
      const res = await axios.get('regions/');
      setRegions(res.data);
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegions(); }, []);

  // --- MAXSUS TOAST DELETE CONFIRMATION ---
  const confirmDelete = (id, name) => {
    toast((t) => (
      <div className={styles.toastConfirm}>
        <div className={styles.toastHeader}>
          <MdWarning className={styles.warningIcon} />
          <span>O'chirishni tasdiqlaysizmi?</span>
        </div>
        <p className={styles.toastBody}>
          Siz rostdan ham <b>"{name}"</b> hududini tizimdan butunlay o'chirmoqchimisiz?
        </p>
        <div className={styles.toastActions}>
          <button 
            className={styles.toastCancel} 
            onClick={() => toast.dismiss(t.id)}
          >
            Bekor qilish
          </button>
          <button 
            className={styles.toastDelete} 
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete(id);
            }}
          >
            Ha, o'chirilsin
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: { minWidth: '350px', padding: '16px', borderRadius: '16px' }
    });
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("O'chirilmoqda...");
    try {
      await axios.delete(`regions/${id}/`);
      toast.success("Muvaffaqiyatli o'chirildi", { id: loadingToast });
      fetchRegions();
    } catch (error) {
      toast.error("O'chirish imkonsiz! Bu hududga shifoxonalar biriktirilgan.", { id: loadingToast });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saqlanmoqda...");
    try {
      if (editId) {
        await axios.put(`regions/${editId}/`, formData);
        toast.success("Hudud tahrirlandi", { id: loadingToast });
      } else {
        await axios.post('regions/', formData);
        toast.success("Yangi hudud qo'shildi", { id: loadingToast });
      }
      setShowModal(false);
      setEditId(null);
      setFormData({ name: '' });
      fetchRegions();
    } catch (error) {
      toast.error("Xatolik yuz berdi!", { id: loadingToast });
    }
  };

  const startEdit = (region) => {
    setEditId(region.id);
    setFormData({ name: region.name });
    setShowModal(true);
  };

  const filteredRegions = regions.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Hududlar</h1>
          <p>Jami: {regions.length} ta hudud mavjud</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setShowModal(true); setEditId(null); setFormData({name: ''}); }}>
          <MdAdd /> Qo'shish
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.searchBox}>
          <MdSearch />
          <input 
            type="text" 
            placeholder="Hududlarni qidirish..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Hudud nomi</th>
                <th>Yaratilgan sana</th>
                <th style={{textAlign: 'right'}}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className={styles.center}>Yuklanmoqda...</td></tr>
              ) : filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <tr key={region.id}>
                    <td>#{region.id}</td>
                    <td className={styles.nameCell}>{region.name}</td>
                    <td>{new Date(region.created_at).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => startEdit(region)}><MdEdit /></button>
                      <button className={styles.deleteBtn} onClick={() => confirmDelete(region.id, region.name)}><MdDelete /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className={styles.center}>Hudud topilmadi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editId ? "Tahrirlash" : "Yangi hudud"}</h3>
              <MdClose onClick={() => setShowModal(false)} className={styles.closeIcon} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Nomi</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({name: e.target.value})}
                  required 
                  autoFocus
                />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Bekor qilish</button>
                <button type="submit" className={styles.saveBtn}>Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegions;
