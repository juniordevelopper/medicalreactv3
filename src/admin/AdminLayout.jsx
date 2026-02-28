import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';
import styles from './adminlayout.module.css';

const AdminLayout = () => {
  const [isCollapsed, setCollapsed] = useState(false); // Desktop uchun
  const [isMobileOpen, setMobileOpen] = useState(false); // Telefon uchun

  return (
    <div className={styles.layout}>
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        isMobileOpen={isMobileOpen}
        toggleSidebar={() => setCollapsed(!isCollapsed)}
        closeMobile={() => setMobileOpen(false)}
      />
      
      <div className={`${styles.mainWrapper} ${isCollapsed ? styles.collapsedWrapper : ''}`}>
        <AdminNavbar 
          toggleSidebar={() => setMobileOpen(!isMobileOpen)} 
          isSidebarCollapsed={isCollapsed}
        />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
