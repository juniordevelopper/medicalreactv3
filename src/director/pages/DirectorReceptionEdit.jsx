import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FaSave, FaTrashAlt, FaArrowLeft, FaUserShield, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import styles from './DirectorReceptionEdit.module.css';

const DirectorReceptionEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shiftInfo, setShiftInfo] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`director/manage-receptions/${id}/`);
                setShiftInfo(res.data.shift_info);
                setUserData(res.data.user_details);
            } catch (err) {
                toast.error("Ma'lumotlarni yuklashda xatolik!");
                navigate('/director/manage-receptions');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("O'zgarishlar saqlanmoqda...");
        try {
            await axios.patch(`director/manage-receptions/${id}/`, {
                shift_info: shiftInfo
            });
            toast.success("Smena ma'lumotlari yangilandi!", { id: loadToast });
            navigate(`/director/detail-receptions/${id}`);
        } catch (err) {
            toast.error("Yangilashda xatolik yuz berdi", { id: loadToast });
        }
    };

    const handleDelete = () => {
        toast((t) => (
            <div className={styles.confirmToast}>
                <div className={styles.toastHeader}>
                    <FaExclamationTriangle className={styles.warnIcon} />
                    <p>Xodimni ishdan bo'shatish</p>
                </div>
                <p className={styles.toastBody}>
                    Rostdan ham <b>{userData?.full_name}</b>ni bo'shatmoqchimisiz? 
                    Uning roli qaytadan 'Patient'ga o'zgaradi.
                </p>
                <div className={styles.toastBtns}>
                    <button 
                        className={styles.confirmBtn} 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const delToast = toast.loading("O'chirilmoqda...");
                            try {
                                await axios.delete(`director/manage-receptions/${id}/`);
                                toast.success("Xodim muvaffaqiyatli bo'shatildi", { id: delToast });
                                navigate('/director/manage-receptions');
                            } catch (err) {
                                toast.error("Xatolik yuz berdi!", { id: delToast });
                            }
                        }}
                    >
                        Ha, bo'shatish
                    </button>
                    <button className={styles.cancelBtn} onClick={() => toast.dismiss(t.id)}>
                        Bekor qilish
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: 'top-center' });
    };

    if (loading) return <div className={styles.loader}>Yuklanmoqda...</div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.navBar}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <FaArrowLeft /> Orqaga
                </button>
            </div>

            <div className={styles.contentArea}>
                <div className={styles.editCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerTitle}>
                            <FaUserShield className={styles.titleIcon} />
                            <div>
                                <h2>Xodimni boshqarish</h2>
                                <p>Smena va xizmat ma'lumotlarini tahrirlash</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className={styles.editForm}>
                        <div className={styles.readonlySection}>
                            <div className={styles.readonlyItem}>
                                <label>Foydalanuvchi ismi</label>
                                <div className={styles.fakeInput}>{userData?.full_name}</div>
                            </div>
                            <div className={styles.readonlyItem}>
                                <label>Email manzil</label>
                                <div className={styles.fakeInput}>{userData?.email}</div>
                            </div>
                        </div>

                        <div className={styles.inputSection}>
                            <label className={styles.fieldLabel}>
                                <FaClock /> Ish vaqti va Smena (Tahrirlash mumkin)
                            </label>
                            <textarea 
                                value={shiftInfo} 
                                onChange={(e) => setShiftInfo(e.target.value)}
                                placeholder="Xodimning ish soatlari va kunlarini kiriting..."
                                className={styles.shiftArea}
                                required
                            />
                        </div>

                        <div className={styles.formFooter}>
                            <button type="submit" className={styles.saveButton}>
                                <FaSave /> O'zgarishlarni saqlash
                            </button>
                            <button type="button" onClick={handleDelete} className={styles.fireButton}>
                                <FaTrashAlt /> Ishdan bo'shatish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DirectorReceptionEdit;
