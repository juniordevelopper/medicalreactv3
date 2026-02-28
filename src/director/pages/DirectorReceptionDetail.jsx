import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
    FaArrowLeft, FaEdit, FaUserCircle, FaEnvelope, 
    FaPhone, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
    FaVenusMars, FaBriefcase, FaHistory 
} from 'react-icons/fa';
import styles from './DirectorReceptionDetail.module.css';

const DirectorReceptionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`director/manage-receptions/${id}/`);
                setData(res.data);
            } catch (err) {
                toast.error("Ma'lumotlarni yuklashda xatolik!");
                navigate('/director/manage-receptions');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    if (loading) return <div className={styles.loader}>Yuklanmoqda...</div>;
    if (!data) return null;

    const { user_details } = data;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.topHeader}>
                <button onClick={() => navigate('/director/manage-reception')} className={styles.backBtn}>
                    <FaArrowLeft /> Ro'yxatga qaytish
                </button>
                <Link to={`/director/edit-receptions/${id}`} className={styles.editBtn}>
                    <FaEdit /> Ma'lumotlarni tahrirlash
                </Link>
            </div>

            <div className={styles.contentGrid}>
                {/* Chap tomon: Profil qisqacha */}
                <div className={styles.profileSidebar}>
                    <div className={styles.avatarWrapper}>
                        {user_details.avatar ? (
                            <img src={user_details.avatar} alt="Avatar" className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {user_details.full_name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h2 className={styles.userName}>{user_details.full_name}</h2>
                    <span className={styles.roleTag}>Reception Xodimi</span>
                    
                    <div className={styles.statusCards}>
                        <div className={`${styles.statusBadge} ${data.is_online ? styles.online : styles.offline}`}>
                            {data.is_online ? "Smenada" : "Oflayn"}
                        </div>
                        <div className={`${styles.statusBadge} ${data.is_available ? styles.available : styles.busy}`}>
                            {data.is_available ? "Bo'sh" : "Band"}
                        </div>
                    </div>
                </div>

                {/* O'ng tomon: Batafsil ma'lumotlar */}
                <div className={styles.detailsArea}>
                    <div className={styles.infoCard}>
                        <h3 className={styles.cardTitle}><FaUserCircle /> Shaxsiy ma'lumotlar</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <label><FaEnvelope /> Email manzil</label>
                                <span>{user_details.email}</span>
                            </div>
                            <div className={styles.infoBox}>
                                <label><FaPhone /> Telefon raqami</label>
                                <span>{user_details.phone || 'Kiritilmagan'}</span>
                            </div>
                            <div className={styles.infoBox}>
                                <label><FaVenusMars /> Jinsi</label>
                                <span>{user_details.gender === 'male' ? 'Erkak' : 'Ayol'}</span>
                            </div>
                            <div className={styles.infoBox}>
                                <label><FaCalendarAlt /> Tug'ilgan sana</label>
                                <span>{user_details.birth_date || 'Noma\'lum'}</span>
                            </div>
                        </div>
                        <div className={styles.addressBox}>
                            <label><FaMapMarkerAlt /> Yashash manzili</label>
                            <span>{user_details.address || 'Manzil ma\'lumotlari yo\'q'}</span>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <h3 className={styles.cardTitle}><FaBriefcase /> Ish faoliyati va Smena</h3>
                        <div className={styles.shiftContainer}>
                            <div className={styles.shiftInfo}>
                                <label><FaClock /> Tayinlangan ish vaqti:</label>
                                <p>{data.shift_info || "Smena ma'lumotlari belgilanmagan"}</p>
                            </div>
                        </div>
                        <div className={styles.metaInfo}>
                            <div className={styles.metaItem}>
                                <FaHistory /> <span>Biriktirilgan sana: {new Date(data.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorReceptionDetail;
