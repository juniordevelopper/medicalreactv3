import React, { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaArrowLeft, FaSearch, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import styles from './DirectorReceptionCreate.module.css';

const DirectorReceptionCreate = () => {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [shiftInfo, setShiftInfo] = useState('');
    const [loading, setLoading] = useState(true);
    
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await axios.get('staff/candidates/');
                setCandidates(res.data);
            } catch (err) {
                toast.error("Nomzodlar ro'yxatini yuklab bo'lmadi");
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCandidates = candidates.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchTerm(user.full_name);
        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return toast.error("Iltimos, nomzodni tanlang!");

        const loadToast = toast.loading("Xodim tayinlanmoqda...");
        try {
            await axios.post('director/manage-receptions/', {
                user: selectedUser.id,
                shift_info: shiftInfo
            });
            toast.success("Reception muvaffaqiyatli tayinlandi!", { id: loadToast });
            navigate('/director/manage-receptions');
        } catch (err) {
            toast.error(err.response?.data?.error || "Xatolik yuz berdi", { id: loadToast });
        }
    };

    if (loading) return <div className={styles.loader}>Yuklanmoqda...</div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.topNavigation}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <FaArrowLeft /> Orqaga qaytish
                </button>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <div className={styles.iconCircle}>
                            <FaUserPlus />
                        </div>
                        <div>
                            <h2>Yangi Reception Tayinlash</h2>
                            <p>Tizimdagi bo'sh foydalanuvchini xodim sifatida biriktiring</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.receptionForm}>
                        {/* Searchable Select Section */}
                        <div className={styles.fieldGroup} ref={dropdownRef}>
                            <label className={styles.fieldLabel}>Nomzodni qidirish va tanlash</label>
                            <div className={styles.searchWrapper}>
                                <FaSearch className={styles.searchIcon} />
                                <input 
                                    type="text"
                                    placeholder="Ism yoki emailni yozing..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                        if(selectedUser) setSelectedUser(null);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    className={`${styles.searchInput} ${selectedUser ? styles.inputSuccess : ''}`}
                                />
                                {selectedUser && <FaCheckCircle className={styles.successCheck} />}
                            </div>

                            {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    {filteredCandidates.length > 0 ? (
                                        filteredCandidates.map(user => (
                                            <div 
                                                key={user.id} 
                                                className={styles.dropdownOption}
                                                onClick={() => handleSelectUser(user)}
                                            >
                                                <div className={styles.userAvatar}>
                                                    {user.full_name.charAt(0)}
                                                </div>
                                                <div className={styles.userMeta}>
                                                    <span className={styles.nameText}>{user.full_name}</span>
                                                    <span className={styles.emailText}>{user.email}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noData}>Nomzod topilmadi</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Shift Info Section */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                                <FaRegClock /> Ish vaqti (Smena ma'lumotlari)
                            </label>
                            <textarea 
                                value={shiftInfo}
                                onChange={(e) => setShiftInfo(e.target.value)}
                                placeholder="Masalan: Dushanba-Juma, 09:00 dan 18:00 gacha"
                                className={styles.shiftTextarea}
                                required
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.submitBtn}>
                                Xodimni Tasdiqlash
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DirectorReceptionCreate;
