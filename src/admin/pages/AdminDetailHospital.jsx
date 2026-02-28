import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MdArrowBack, MdEdit, MdLocationOn, MdPerson, 
  MdCalendarToday, MdBusiness, MdPhotoLibrary, MdVerifiedUser
} from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './admindetailhospital.module.css';

const AdminDetailHospital = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get(`hospitals/${id}/`);
        setHospital(res.data);
      } catch (error) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
        navigate('/admin/hospitals');
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [id, navigate]);

  if (loading) return <div className={styles.loaderWrapper}><div className={styles.spinner}></div></div>;
  if (!hospital) return <div className={styles.errorMsg}>Shifoxona topilmadi.</div>;

  return (
    <div className={styles.container}>
      {/* HEADER NAVIGATION */}
      <header className={styles.topNav}>
        <button onClick={() => navigate('/admin/hospitals')} className={styles.backBtn}>
          <MdArrowBack /> Ro'yxatga qaytish
        </button>
        <div className={styles.actions}>
           <Link to={`/admin/hospitals/update-hospital/${id}`} className={styles.editBtn}>
            <MdEdit /> Tahrirlash
          </Link>
        </div>
      </header>

      <div className={styles.contentGrid}>
        {/* LEFT SIDE: MAIN INFO */}
        <div className={styles.mainInfo}>
          <section className={styles.heroCard}>
            <div className={styles.heroImage}>
              {hospital.image ? (
                <img src={hospital.image} alt={hospital.name} />
              ) : (
                <div className={styles.noImage}><MdBusiness /></div>
              )}
              <span className={styles.statusBadge}>Aktiv</span>
            </div>
            
            <div className={styles.heroBody}>
              <h1 className={styles.hospTitle}>{hospital.name}</h1>
              <p className={styles.addressText}><MdLocationOn /> {hospital.address}</p>
              
              <div className={styles.quickStats}>
                <div className={styles.statLine}>
                  <MdVerifiedUser />
                  <span>Hudud: <strong>{hospital.region_details?.name}</strong></span>
                </div>
                <div className={styles.statLine}>
                  <MdCalendarToday />
                  <span>Ro'yxatdan o'tdi: <strong>{new Date(hospital.created_at).toLocaleDateString()}</strong></span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <MdBusiness /> <h3>Mavjud bo'limlar</h3>
            </div>
            <div className={styles.deptGrid}>
              {hospital.department_details?.length > 0 ? (
                hospital.department_details.map((dept) => (
                  <div key={dept.id} className={styles.deptItem}>
                    {dept.name}
                  </div>
                ))
              ) : (
                <p className={styles.empty}>Bo'limlar qo'shilmagan</p>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE: MANAGEMENT */}
        <div className={styles.sidePanel}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <MdPerson /> <h3>Mas'ul Direktor</h3>
            </div>
            <div className={styles.directorProfile}>
              <div className={styles.avatar}>
                {hospital.director_name?.charAt(0) || "?"}
              </div>
              <div className={styles.dirInfo}>
                <h4>{hospital.director_name || "Tayinlanmagan"}</h4>
                <p>Boshqaruvchi rahbar</p>
              </div>
              {hospital.director && (
                <Link to={`/admin/users/detail/${hospital.director}`} className={styles.profileBtn}>
                  Profilga o'tish
                </Link>
              )}
            </div>
          </section>

          <section className={styles.card}>
             <div className={styles.cardHeader}>
              <MdPhotoLibrary /> <h3>Media ma'lumotlar</h3>
            </div>
            <div className={styles.mediaHint}>
               <p>Shifoxonaning asosiy ko'rinishi tizimda saqlangan. Rasmni o'zgartirish uchun tahrirlash bo'limiga o'ting.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailHospital;
