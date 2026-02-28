import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/DoctorSidebar';
import Navbar from './components/DoctorNavbar';
import styles from './DoctorLayout.module.css';
import { DoctorProvider } from './components/DoctorContext';
import { Outlet } from 'react-router-dom';

const DoctorLayout = () => {
  return (
    <DoctorProvider>
      <div className={styles.layoutContainer}>
        <Sidebar />
        <div className={styles.mainWrapper}>
          <Navbar />
          <main className={styles.contentArea}>
            <Outlet /> 
          </main>
        </div>
      </div>
    </DoctorProvider>
  );
};
export default DoctorLayout;
