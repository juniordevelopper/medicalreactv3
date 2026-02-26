import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MdLocalHospital, MdPeople, MdMedicalServices, 
  MdArrowForward, MdVerifiedUser, MdTimer, MdChat,
  MdFacebook, MdEmail, MdPhone
} from 'react-icons/md';
import { FaTelegram, FaInstagram } from 'react-icons/fa';
import styles from './welcome.module.css';

const Welcome = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <MdMedicalServices className={styles.logoIcon} />
          <span>Medical Online</span>
        </div>
        
        <ul className={styles.navLinks}>
          <li onClick={() => scrollToSection('about')}>Afzalliklar</li>
          <li onClick={() => scrollToSection('process')}>Qanday ishlaydi?</li>
        </ul>

        <div className={styles.authBtns}>
          <Link to="/auth/login" className={styles.loginBtn}>Kirish</Link>
          <Link to="/auth/register" className={styles.registerBtn}>Ro'yxatdan o'tish</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Yangi avlod tibbiyot tizimi</div>
          <h1 className={styles.gradientText}>Sog'lig'ingizni <br/> Raqamli Boshqaring</h1>
          <p>Navbat kutishdan charchadingizmi? Shifokor bilan masofaviy aloqa va onlayn navbat tizimi orqali vaqtingizni tejang.</p>
          <div className={styles.heroAction}>
            <Link to="/auth/register" className={styles.ctaBtn}>
              Boshlash <MdArrowForward />
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.blob}></div>
          <div className={styles.floatingCard}>
            <MdTimer /> <span>10 daqiqalik navbat</span>
          </div>
        </div>
      </header>

      {/* WHY US SECTION */}
      <section id="about" className={styles.section}>
        <h2 className={styles.sectionTitle}>Nega aynan bizning platforma?</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <MdVerifiedUser className={styles.cardIcon} />
            <h3>Ishonchli Shifokorlar</h3>
            <p>Barcha shifokorlarimiz malakasi admin tomonidan tasdiqlangan va tekshirilgan.</p>
          </div>
          <div className={styles.card}>
            <MdChat className={styles.cardIcon} />
            <h3>Onlayn Konsultatsiya</h3>
            <p>Shifokor bilan chat orqali tahlil natijalarini yuborish va xabar almashish imkoniyati.</p>
          </div>
          <div className={styles.card}>
            <MdTimer className={styles.cardIcon} />
            <h3>Aniq Vaqt</h3>
            <p>Aqlli algoritm orqali navbatingiz kelish vaqtini sekundigacha hisoblab beramiz.</p>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="process" className={styles.processWrapper}>
        <h2 className={styles.sectionTitle}>Xizmatdan foydalanish jarayoni</h2>
        <div className={styles.stepsGrid}>
          {[
            {s: 1, t: "Ro'yxatdan o'ting", d: "Bir necha soniyada shaxsiy hisobingizni yarating."},
            {s: 2, t: "Hududni tanlang", d: "O'zingizga yaqin shifoxonalar ro'yxatini ko'ring."},
            {s: 3, t: "Shifokorni tanlang", d: "Bo'lim va shifokor haqida ma'lumotlarni o'rganing."},
            {s: 4, t: "Navbat oling", d: "Vaqtingizni rejalashtiring va ko'rikka boring."}
          ].map(item => (
            <div key={item.s} className={styles.stepCard}>
              <div className={styles.stepNum}>{item.s}</div>
              <h4>{item.t}</h4>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <MdMedicalServices className={styles.logoIcon} />
              <span>Medical Online</span>
            </div>
            <p>Sifatli tibbiy xizmat endi yanada yaqinroq.</p>
          </div>
          
          <div className={styles.footerLinks}>
            <h4>Bo'limlar</h4>
            <ul>
              <li onClick={() => scrollToSection('about')}>Afzalliklar</li>
              <li onClick={() => scrollToSection('process')}>Jarayon</li>
              <li><Link to="/auth/login">Kirish</Link></li>
            </ul>
          </div>

          <div className={styles.footerContact}>
            <h4>Bog'lanish</h4>
            <p><MdEmail /> info@medicalonline.uz</p>
            <p><MdPhone /> +998 90 123 45 67</p>
            <div className={styles.socials}>
              <FaTelegram />
              <FaInstagram />
              <MdFacebook />
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 Medical Online. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
