import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DirectorSidebar from './components/DirectorSidebar';
import DirectorNavbar from './components/DirectorNavbar';
import styles from './directorlayout.module.css';

const DirectorLayout = () => {
  // Avtomatik ravishda ekran o'lchamiga qarab sidebar holatini belgilash
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1080);

  // Ekran o'zgarganda sidebarni boshqarish
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1080) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.layout}>
      <DirectorSidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setSidebarOpen(false)} 
      />
      
      <div className={`${styles.mainWrapper} ${!isSidebarOpen ? styles.fullWidth : ''}`}>
        <DirectorNavbar 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>

      {/* Overlay faqat mobil versiyada (1080px dan kichik) */}
      {isSidebarOpen && window.innerWidth <= 1080 && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default DirectorLayout;
