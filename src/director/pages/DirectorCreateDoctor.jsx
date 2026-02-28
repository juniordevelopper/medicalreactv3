import React, { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import styles from './directorcreatedoctor.module.css';
import { MdPersonAdd, MdArrowBack, MdClose } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DirectorCreateDoctor = () => {
  const [candidates, setCandidates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tanlovlar holati
  const [selectedUser, setSelectedUser] = useState(null);
  const [deptId, setDeptId] = useState("");

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Backend URL'larni aniqlashtiring: ko'pincha /api/v1/departments/ bo'ladi
        const [candRes, deptRes] = await Promise.all([
          axios.get('staff/candidates/'), 
          axios.get('departments/').catch(() => ({ data: [] })) 
        ]);
        
        setCandidates(Array.isArray(candRes.data) ? candRes.data : []);
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      } catch (err) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FILTR MANTIQLI (CLIENT-SIDE)
  const filteredCandidates = candidates.filter(u => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true; 

    const name = (u.full_name || "").toLowerCase();
    const phone = (u.phone_number || "");
    const email = (u.email || "").toLowerCase();

    return name.includes(search) || phone.includes(search) || email.includes(search);
  });

  const handleAssign = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.warning("Iltimos, nomzodni qidirib toping va tanlang!");
      return;
    }
    if (!deptId) {
      toast.warning("Bo'limni tanlang!");
      return;
    }

    try {
      // POST so'rovi
      const payload = {
        user: selectedUser.id,
        department: parseInt(deptId), // Backend ko'pincha ID'ni raqam shaklida kutadi
      };

      await axios.post('director/manage-doctors/', payload);
      
      toast.success("Shifokor muvaffaqiyatli tayinlandi!");
      // Bir oz kutib keyin o'tish (toast ko'rinishi uchun)
      setTimeout(() => navigate('/director/manage-doctors'), 1500);
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Xatolik yuz berdi!";
      toast.error(errorMsg);
    }
  };

  if (loading) return <div className={styles.loading}>Yuklanmoqda...</div>;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.backSection} onClick={() => navigate(-1)} style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
            <MdArrowBack className={styles.backIcon} /> 
            <span className={styles.backLabel}>Ortga</span>
          </div>
          <h2><MdPersonAdd /> Shifokor Tayinlash</h2>
        </div>

        <form onSubmit={handleAssign} className={styles.form}>
          
          {/* USER QIDIRUV VA TANLASH */}
          <div className={styles.formGroup} ref={dropdownRef}>
            <label className={styles.label}>Nomzodni qidiring va tanlang *</label>
            <div className={styles.inputWrapper}>
              <input 
                type="text"
                className={styles.input}
                placeholder="F.I.SH, Telefon yoki Email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                required={!selectedUser}
                autoComplete="off"
              />
              {selectedUser && (
                <div className={styles.selectedOverlay}>
                  <span>{selectedUser.full_name}</span>
                  <MdClose 
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchTerm("");
                    }} 
                    className={styles.closeIcon} 
                    style={{cursor: 'pointer'}}
                  />
                </div>
              )}
            </div>

            {showDropdown && !selectedUser && (
              <div className={styles.dropdown}>
                {filteredCandidates.length > 0 ? filteredCandidates.map(u => (
                  <div 
                    key={u.id} 
                    className={styles.dropdownItem} 
                    onClick={() => {
                      setSelectedUser(u); 
                      setSearchTerm(u.full_name); 
                      setShowDropdown(false);
                    }}
                  >
                    <div className={styles.userName}>{u.full_name}</div>
                    <div className={styles.userDetails}>{u.email} | {u.phone_number || "Tel yo'q"}</div>
                  </div>
                )) : <div className={styles.noResult}>Nomzod topilmadi</div>}
              </div>
            )}
          </div>

          {/* BO'LIM TANLASH */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Bo'lim *</label>
            <select 
              className={styles.select} 
              required 
              value={deptId} 
              onChange={(e) => setDeptId(e.target.value)}
            >
              <option value="">-- Bo'limni tanlang --</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Tasdiqlash va Tayinlash
          </button>
        </form>
      </div>
    </div>
  );
};

export default DirectorCreateDoctor;
