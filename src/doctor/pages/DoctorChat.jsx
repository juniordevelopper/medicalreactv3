import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axios';
import { useDoctor } from '../components/DoctorContext';
import { 
  FiSend, FiUser, FiPaperclip, FiMic, FiSquare, 
  FiMoreVertical, FiSearch, FiFileText, FiMessageSquare, FiDownload 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from './DoctorChat.module.css';

const DoctorChat = () => {
  const { doctor } = useDoctor();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // WebSocket va Scroll uchun ref'lar
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Audio yozish uchun state'lar
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // 1. Chatlar ro'yxatini yuklash
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get('doctor/conversations/');
        setConversations(res.data);
      } catch (err) {
        toast.error("Chatlarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // 2. WebSocket va Tarixni yuklash
  useEffect(() => {
    if (activeChat) {
      // Xabarlar tarixini yuklash
      axiosInstance.get(`doctor/conversations/${activeChat.id}/messages/`)
        .then(res => setMessages(res.data));

      // WS ulanish (Dinamik IP va Token bilan)
      const token = localStorage.getItem('access');
      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const currentIP = window.location.hostname;
      
      socket.current = new WebSocket(`${wsProtocol}://${currentIP}:8000/ws/chat/${activeChat.id}/?token=${token}`);

      socket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setMessages((prev) => [...prev, data]);
      };

      return () => {
        if (socket.current) socket.current.close();
      };
    }
  }, [activeChat]);

  // Har gal xabar kelganda scroll qilish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Matnli xabar yuborish (WS orqali)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket.current) return;

    socket.current.send(JSON.stringify({ 'message': newMessage }));
    setNewMessage("");
  };

  // 4. Fayl yuborish mantiqi (REST API orqali)
  const uploadFile = async (fileBlob, fileName = null) => {
    const formData = new FormData();
    if (fileName) {
      formData.append('file', fileBlob, fileName);
    } else {
      formData.append('file', fileBlob);
    }

    try {
      const res = await axiosInstance.post(`doctor/conversations/${activeChat.id}/send_message/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // WebSocket orqali hamma qabul qilishi uchun (backendda mantiq bo'lsa) 
      // yoki shunchaki UI ga qo'shamiz
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      toast.error("Fayl yuborishda xatolik!");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) uploadFile(e.target.files[0]);
  };

  // 5. Ovoz yozish mantiqi
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        uploadFile(audioBlob, 'voice_message.wav');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      toast.error("Mikrofonga ruxsat berilmadi!");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  return (
    <div className={styles.chatWrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Suhbatlar</h3>
          <div className={styles.searchBar}>
            <FiSearch /> <input type="text" placeholder="Bemor qidirish..." />
          </div>
        </div>
        <div className={styles.convList}>
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`${styles.convItem} ${activeChat?.id === conv.id ? styles.active : ''}`}
              onClick={() => setActiveChat(conv)}
            >
              <div className={styles.avatar}>
                {conv.patient_avatar ? <img src={conv.patient_avatar} alt="P" /> : <FiUser />}
              </div>
              <div className={styles.convDetails}>
                <h4>{conv.patient_name}</h4>
                <p>{conv.last_message || "Xabar yo'q"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Oynasi */}
      <div className={styles.chatWindow}>
        {activeChat ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.activeUser}>
                <h4>{activeChat.patient_name}</h4>
                <span className={styles.onlineStatus}>Onlayn</span>
              </div>
              <FiMoreVertical className={styles.moreIcon} />
            </div>

            <div className={styles.messagesArea}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.msgRow} ${msg.sender === doctor?.user_id ? styles.ownMsg : ''}`}>
                  <div className={styles.bubble}>
                    {msg.text && <p>{msg.text}</p>}
                    
                    {msg.file && (
                      <div className={styles.fileContainer}>
                        {msg.file.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                          <img src={msg.file} alt="img" className={styles.chatImg} />
                        ) : msg.file.match(/\.(wav|mp3|ogg)$/i) ? (
                          <audio src={msg.file} controls className={styles.chatAudio} />
                        ) : (
                          <a href={msg.file} target="_blank" rel="noreferrer" className={styles.fileLink}>
                            <FiFileText /> Faylni yuklab olish
                          </a>
                        )}
                      </div>
                    )}
                    <span className={styles.time}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
              <label className={styles.iconBtn}>
                <FiPaperclip />
                <input type="file" hidden onChange={handleFileChange} />
              </label>

              {isRecording ? (
                <div className={styles.recordingStatus}>
                  <div className={styles.pulse} />
                  <span>Ovoz yozilmoqda...</span>
                  <button onClick={stopRecording} className={styles.stopBtn}><FiSquare /></button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    placeholder="Xabar yozing..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  {newMessage.trim() ? (
                    <button type="submit" className={styles.sendBtn}><FiSend /></button>
                  ) : (
                    <button type="button" onClick={startRecording} className={styles.micBtn}><FiMic /></button>
                  )}
                </form>
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyChat}>
            <FiMessageSquare size={60} />
            <p>Suhbatni tanlang</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
