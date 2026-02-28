import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaEye, FaPlus, FaSearch, FaUserTie, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import styles from './DirectorReceptionList.module.css';

const DirectorReceptionList = () => {
    const [receptions, setReceptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReceptions = async () => {
            try {
                const res = await axios.get('director/manage-receptions/');
                setReceptions(res.data);
            } catch (err) {
                toast.error("Ma'lumotlarni yuklashda xatolik!", { position: 'top-center' });
            } finally {
                setLoading(false);
            }
        };
        fetchReceptions();
    }, []);

    // Client-side qidiruv mantiqi
    const filteredReceptions = receptions.filter(item => {
        const fullName = item.user_details.full_name?.toLowerCase() || '';
        const email = item.user_details.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || email.includes(search);
    });

    // Avatar render qilish logikasi
    const renderAvatar = (user) => {
        if (user.avatar) {
            return <img src={user.avatar} alt={user.full_name} className={styles.avatarImg} />;
        }
        const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : '?';
        return <div className={styles.avatarPlaceholder}>{initial}</div>;
    };

    if (loading) return <div className={styles.loader}>Ma'lumotlar yuklanmoqda...</div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerSection}>
                <div className={styles.titleWrapper}>
                    <div className={styles.iconBox}>
                        <FaUserTie />
                    </div>
                    <div>
                        <h1>Reception Boshqaruvi</h1>
                        <p>Shifoxona reception xodimlarining to'liq ro'yxati va holati</p>
                    </div>
                </div>
                <Link to="/director/create-receptions" className={styles.addBtn}>
                    <FaPlus /> Yangi xodim tayinlash
                </Link>
            </div>

            <div className={styles.controlBar}>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Xodim ismi yoki emaili orqali qidirish..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.statsBadge}>
                    Jami: <b>{filteredReceptions.length}</b> ta xodim
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>Xodim ma'lumotlari</th>
                            <th>Aloqa</th>
                            <th>Ish vaqti (Smena)</th>
                            <th>Holati</th>
                            <th className={styles.centerAlign}>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReceptions.length > 0 ? (
                            filteredReceptions.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className={styles.userProfile}>
                                            {renderAvatar(item.user_details)}
                                            <div className={styles.userMeta}>
                                                <span className={styles.userName}>{item.user_details.full_name}</span>
                                                <span className={styles.userRole}>Receptionist</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.contactInfo}>
                                            <div className={styles.infoRow}><FaEnvelope /> {item.user_details.email}</div>
                                            <div className={styles.infoRow}><FaPhoneAlt /> {item.user_details.phone || '—'}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.shiftBadge}>
                                            {item.shift_info || 'Smena belgilanmagan'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={item.is_online ? styles.statusOnline : styles.statusOffline}>
                                            <span className={styles.statusDot}></span>
                                            {item.is_online ? "Smenada" : "Oflayn"}
                                        </div>
                                    </td>
                                    <td className={styles.centerAlign}>
                                        <Link 
                                            to={`/director/detail-receptions/${item.id}`} 
                                            className={styles.viewActionBtn}
                                            title="Ko'rish"
                                        >
                                            <FaEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.noResults}>
                                    Qidiruv bo'yicha hech qanday xodim topilmadi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DirectorReceptionList;
