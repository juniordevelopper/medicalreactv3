import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCloudUpload, MdSave, MdEdit, MdDeleteForever, MdWarning } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './adminupdatehospital.module.css';

const AdminUpdateHospital = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    region: '',
    director: null,
    selectedDepts: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospRes, regRes, depRes, candRes] = await Promise.all([
          axios.get(`hospitals/${id}/`),
          axios.get('regions/'),
          axios.get('departments/'),
          axios.get('staff/candidates/')
        ]);

        const h = hospRes.data;
        setFormData({
          name: h.name,
          address: h.address,
          region: h.region,
          director: h.director || null,
          selectedDepts: h.departments || [],
        });
        setPreview(h.image);
        setRegions(regRes.data);
        setDepartments(depRes.data);
        setCandidates(candRes.data);
      } catch (error) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
        navigate('/admin/hospitals');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // O'CHIRISHNI TASDIQLASH (TOAST ORQALI)
  const confirmDelete = () => {
    toast((t) => (
      <div className={styles.confirmBox}>
        <MdWarning className={styles.warnIcon} />
        <p>Diqqat! <b>{formData.name}</b> shifoxonasini o'chirishni tasdiqlaysizmi?</p>
        <div className={styles.confirmBtns}>
          <button 
            className={styles.cancelBtn} 
            onClick={() => toast.dismiss(t.id)}
          >
            Bekor qilish
          </button>
          <button 
            className={styles.deleteConfirmBtn} 
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete();
            }}
          >
            Ha, o'chirilsin
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center', // Markazda chiqishi uchun
    });
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`hospitals/${id}/`);
      toast.success("Shifoxona tizimdan butunlay o'chirildi");
      navigate('/admin/hospitals');
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('region', formData.region);
    data.append('director', formData.director || "");
    formData.selectedDepts.forEach(dId => data.append('departments', dId));
    if (imageFile) data.append('image', imageFile);

    try {
      await axios.patch(`hospitals/${id}/`, data);
      toast.success("Muvaffaqiyatli yangilandi!");
      navigate(`/admin/hospitals/detail-hospital/${id}`);
    } catch (error) {
      toast.error("Xatolik! Ma'lumotlarni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className={styles.loading}>Yuklanmoqda...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.leftHeader}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}><MdArrowBack /> Orqaga</button>
          <h1 className={styles.title}>Tahrirlash</h1>
        </div>
        <button type="button" onClick={confirmDelete} className={styles.deleteBtn} disabled={loading}>
          <MdDeleteForever /> Shifoxonani o'chirish
        </button>
      </header>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.mainGrid}>
          <div className={styles.leftCol}>
            <div className={styles.inputBox}>
              <label>Shifoxona nomi</label>
              <input type="text" value={formData.name} required onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className={styles.inputBox}>
              <label>To'liq manzil</label>
              <input type="text" value={formData.address} required onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className={styles.flexInputs}>
              <div className={styles.inputBox}>
                <label>Hudud</label>
                <select value={formData.region} required onChange={e => setFormData({...formData, region: e.target.value})}>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className={styles.inputBox}>
                <label>Direktor (Ixtiyoriy)</label>
                <select value={formData.director || ""} onChange={e => setFormData({...formData, director: e.target.value})}>
                  <option value="">--- Bo'sh qoldirish ---</option>
                  {candidates.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  {formData.director && !candidates.find(c => String(c.id) === String(formData.director)) && (
                    <option value={formData.director}>Hozirgi direktor</option>
                  )}
                </select>
              </div>
            </div>
            <div className={styles.deptSection}>
              <label className={styles.fieldLabel}>Bo'limlar</label>
              <div className={styles.deptGrid}>
                {departments.map(d => (
                  <button 
                    type="button" 
                    key={d.id} 
                    className={`${styles.deptBtn} ${formData.selectedDepts.includes(d.id) ? styles.activeDept : ''}`} 
                    onClick={() => setFormData({...formData, selectedDepts: formData.selectedDepts.includes(d.id) ? formData.selectedDepts.filter(i => i !== d.id) : [...formData.selectedDepts, d.id]})}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <label className={styles.fieldLabel}>Asosiy rasm</label>
            <div className={styles.imageBox}>
              <input type="file" id="hospImg" hidden accept="image/*" onChange={handleImageChange} />
              <div className={styles.previewWrapper}>
                <img src={preview} alt="Hospital" />
                <label htmlFor="hospImg" className={styles.overlay}><MdEdit /> Almashtirish</label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Saqlanmoqda..." : <><MdSave /> Saqlash</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateHospital;
