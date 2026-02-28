import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdWarning, MdBusinessCenter } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './admindepartments.module.css';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('departments/');
      setDepartments(res.data);
    } catch (error) {
      toast.error("Bo'limlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  // --- DELETE CONFIRMATION TOAST ---
  const confirmDelete = (id, name) => {
    toast((t) => (
      <div className={styles.toastConfirm}>
        <div className={styles.toastHeader}>
          <MdWarning className={styles.warningIcon} />
          <span>Bo'limni o'chirish</span>
        </div>
        <p className={styles.toastBody}>
          Siz rostdan ham <b>"{name}"</b> bo'limini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
        </p>
        <div className={styles.toastActions}>
          <button className={styles.toastCancel} onClick={() => toast.dismiss(t.id)}>Bekor qilish</button>
          <button 
            className={styles.toastDelete} 
            onClick={() => { toast.dismiss(t.id); handleDelete(id); }}
          >
            O'chirilsin
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleDelete = async (id) => {
    const loadId = toast.loading("O'chirilmoqda...");
    try {
      await axios.delete(`departments/${id}/`);
      toast.success("Bo'lim muvaffaqiyatli o'chirildi", { id: loadId });
      fetchDepartments();
    } catch (error) {
      toast.error("O'chirish imkonsiz! Bo'lim shifoxonalarga biriktirilgan.", { id: loadId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading("Saqlanmoqda...");
    try {
      if (editId) {
        await axios.put(`departments/${editId}/`, formData);
        toast.success("Bo'lim yangilandi", { id: loadId });
      } else {
        await axios.post('departments/', formData);
        toast.success("Yangi bo'lim qo'shildi", { id: loadId });
      }
      closeModal();
      fetchDepartments();
    } catch (error) {
      toast.error("Xatolik yuz berdi!", { id: loadId });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ name: '', description: '' });
  };

  const filtered = departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSec}>
          <h1>Shifoxona Bo'limlari</h1>
          <p>Tizimda jami {departments.length} ta umumiy bo'lim mavjud</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <MdAdd /> Yangi Bo'lim
        </button>
      </header>

      <div className={styles.mainCard}>
        <div className={styles.topBar}>
          <MdSearch />
          <input 
            type="text" 
            placeholder="Bo'lim nomini yozing..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Bo'lim nomi</th>
                <th>Tavsif</th>
                <th>Yangilangan vaqt</th>
                <th style={{textAlign: 'right'}}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className={styles.center}>Yuklanmoqda...</td></tr>
              ) : filtered.map(dept => (
                <tr key={dept.id}>
                  <td className={styles.nameCell}>
                    <MdBusinessCenter className={styles.cellIcon} /> {dept.name}
                  </td>
                  <td className={styles.descCell}>{dept.description || "Tavsif yo'q"}</td>
                  <td>{new Date(dept.updated_at).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => { 
                      setEditId(dept.id); 
                      setFormData({name: dept.name, description: dept.description || ''}); 
                      setShowModal(true); 
                    }}><MdEdit /></button>
                    <button className={styles.deleteBtn} onClick={() => confirmDelete(dept.id, dept.name)}><MdDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <h3>{editId ? "Tahrirlash" : "Yangi Bo'lim"}</h3>
              <MdClose onClick={closeModal} className={styles.close} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Bo'lim nomi</label>
                <input 
                  type="text" value={formData.name} required
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className={styles.field}>
                <label>Tavsif (ixtiyoriy)</label>
                <textarea 
                  rows="3" value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className={styles.btns}>
                <button type="button" onClick={closeModal} className={styles.cancel}>Bekor qilish</button>
                <button type="submit" className={styles.save}>Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
