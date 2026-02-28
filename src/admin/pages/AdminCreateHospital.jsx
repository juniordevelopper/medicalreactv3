import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCloudUpload, MdClose, MdSave, MdBusiness, MdLocationOn, MdPerson, MdLayers } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './admincreatehospital.module.css';

const AdminCreateHospital = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    region: '',
    director: '',
    selectedDepts: [],
  });

  const [image, setImage] = useState(null); // Faqat bitta fayl
  const [preview, setPreview] = useState(null); // Faqat bitta URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, depRes, candRes] = await Promise.all([
          axios.get('regions/'),
          axios.get('departments/'),
          axios.get('staff/candidates/')
        ]);
        setRegions(regRes.data);
        setDepartments(depRes.data);
        setCandidates(candRes.data);
      } catch (error) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const toggleDept = (id) => {
    const current = [...formData.selectedDepts];
    if (current.includes(id)) {
      setFormData({...formData, selectedDepts: current.filter(i => i !== id)});
    } else {
      setFormData({...formData, selectedDepts: [...current, id]});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Shifoxona rasmini yuklang!");
    if (formData.selectedDepts.length === 0) return toast.error("Kamida bitta bo'lim tanlang!");

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('region', formData.region);
    
    // Agar direktor tanlangan bo'lsa yuboramiz
    if (formData.director) data.append('director', formData.director);
    
    // Many-to-many bo'limlar
    formData.selectedDepts.forEach(id => data.append('departments', id));
    
    // Yagona rasm (Backenddagi yangi 'image' maydoni uchun)
    data.append('image', image);

    try {
      await axios.post('hospitals/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Shifoxona muvaffaqiyatli yaratildi!");
      navigate('/admin/hospitals');
    } catch (error) {
      const msg = error.response?.data?.error || "Xatolik! Ma'lumotlarni tekshiring.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <MdArrowBack /> Orqaga
        </button>
        <h1 className={styles.title}>Yangi shifoxona qo'shish</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.mainGrid}>
          {/* Chap qism: Ma'lumotlar */}
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <MdBusiness /> Asosiy ma'lumotlar
            </div>
            
            <div className={styles.inputBox}>
              <label>Shifoxona nomi</label>
              <input type="text" required placeholder="Masalan: Markaziy Shifoxona" 
                onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className={styles.inputBox}>
              <label>To'liq manzil</label>
              <input type="text" required placeholder="Ko'cha, uy raqami..." 
                onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className={styles.flexInputs}>
              <div className={styles.inputBox}>
                <label><MdLocationOn /> Hudud</label>
                <select required onChange={e => setFormData({...formData, region: e.target.value})}>
                  <option value="">Tanlang...</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div className={styles.inputBox}>
                <label><MdPerson /> Direktor</label>
                <select onChange={e => setFormData({...formData, director: e.target.value})}>
                  <option value="">Keyinroq tayinlash</option>
                  {candidates.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.deptContainer}>
              <label className={styles.labelWithIcon}><MdLayers /> Bo'limlarni tanlang</label>
              <div className={styles.deptBadgeGrid}>
                {departments.map(d => (
                  <div 
                    key={d.id} 
                    className={`${styles.deptBadge} ${formData.selectedDepts.includes(d.id) ? styles.activeBadge : ''}`}
                    onClick={() => toggleDept(d.id)}
                  >
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* O'ng qism: Rasm */}
          <div className={styles.imageSection}>
            <div className={styles.sectionTitle}>Rasm yuklash</div>
            <div className={styles.uploadWrapper}>
              {!preview ? (
                <label className={styles.dropzone}>
                  <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                  <MdCloudUpload className={styles.uploadIcon} />
                  <p>Asosiy rasm uchun bosing</p>
                  <span>JPEG, PNG (Max 5MB)</span>
                </label>
              ) : (
                <div className={styles.previewContainer}>
                  <img src={preview} alt="Hospital preview" />
                  <button type="button" className={styles.deleteImg} onClick={removeImage}>
                    <MdClose />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.loader}></span> : <><MdSave /> Saqlash va Yaratish</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateHospital;
