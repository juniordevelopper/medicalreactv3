import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiUser, FiClock, FiMessageCircle, FiSkipForward, 
  FiCheckCircle, FiRefreshCw, FiCalendar 
} from 'react-icons/fi';
import styles from './DoctorQueues.module.css';

const DoctorQueues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('current');

  const fetchQueues = async () => {
    setLoading(true);
    try {
      // Backend: router.register(r'doctor/queues', ...)
      const endpoint = view === 'current' ? 'doctor/queues/' : 'doctor/queues/my_patients_history/';
      const res = await axiosInstance.get(endpoint);
      
      // Backend history metodida "history" keyi bilan qaytarganini hisobga olamiz
      const data = view === 'current' ? res.data : res.data.history;
      setQueues(Array.isArray(data) ? data : []); 
    } catch (err) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, [view]);

  const handleSkip = async (id) => {
    try {
      await axiosInstance.post(`doctor/queues/${id}/skip_patient/`);
      toast.success("Bemor o'tkazib yuborildi va email ketdi.");
      fetchQueues();
    } catch (err) {
      toast.error("Xatolik: Bemor topilmadi yoki huquq yo'q.");
    }
  };

  const handleStartChat = async (id) => {
    try {
      const res = await axiosInstance.post(`doctor/queues/${id}/start_chat/`);
      toast.success(res.data.msg);
      // conversation_id orqali chat sahifasiga o'tish mantiqi shu yerda bo'ladi
    } catch (err) {
      toast.error("Chatni faollashtirib bo'lmadi.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <div className={styles.titleBox}>
          <h2>{view === 'current' ? "Bugungi navbatlar" : "Bemorlar tarixi"}</h2>
          <p>{new Date().toLocaleDateString('uz-UZ')}</p>
        </div>
        <div className={styles.tabButtons}>
          <button 
            className={view === 'current' ? styles.activeTab : ''} 
            onClick={() => setView('current')}
          >
            <FiCalendar /> Navbatdagilar
          </button>
          <button 
            className={view === 'history' ? styles.activeTab : ''} 
            onClick={() => setView('history')}
          >
            <FiRefreshCw /> Tarix
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loader}>Yuklanmoqda...</div>
        ) : (
          <table className={styles.qTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>Bemor Ismi</th>
                <th>Belgilangan Vaqt</th>
                <th>Holat</th>
                {view === 'current' && <th>Amallar</th>}
              </tr>
            </thead>
            <tbody>
              {queues.length > 0 ? queues.map((q) => (
                <tr key={q.id}>
                  <td><span className={styles.orderNum}>{q.number}</span></td>
                  <td>
                    <div className={styles.patientName}>
                      <FiUser className={styles.uIcon} /> {q.patient_name || q.patient?.full_name}
                    </div>
                  </td>
                  <td>
                    <div className={styles.timeWrap}>
                      <FiClock /> {new Date(q.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                  {view === 'current' && (
                    <td>
                      <div className={styles.btnGroup}>
                        <button 
                          className={styles.chatBtn} 
                          onClick={() => handleStartChat(q.id)}
                          title="Chatni boshlash"
                        >
                          <FiMessageCircle />
                        </button>
                        {q.status !== 'skipped' && (
                          <button 
                            className={styles.skipBtn} 
                            onClick={() => handleSkip(q.id)}
                            title="O'tkazib yuborish"
                          >
                            <FiSkipForward />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className={styles.noData}>Ma'lumot topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorQueues;
