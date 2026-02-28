import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MdAdd, MdSearch, MdLocationOn, MdDomain, 
  MdBusiness, MdKeyboardArrowRight, MdPeople, MdLayers 
} from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './adminlisthospital.module.css';

const AdminListHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ region: '', department: '', search: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospRes, regRes, depRes] = await Promise.all([
          axios.get('hospitals/'),
          axios.get('regions/'),
          axios.get('departments/')
        ]);
        setHospitals(hospRes.data);
        setRegions(regRes.data);
        setDepartments(depRes.data);
      } catch (error) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredHospitals = hospitals.filter(h => {
    const matchRegion = filters.region ? h.region_details.id === parseInt(filters.region) : true;
    const matchDept = filters.department ? h.departments.includes(parseInt(filters.department)) : true;
    const matchSearch = h.name.toLowerCase().includes(filters.search.toLowerCase());
    return matchRegion && matchDept && matchSearch;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSec}>
          <h1>Shifoxonalar ro'yxati</h1>
          <p>Tizimda jami <span>{hospitals.length} ta</span> muassasa bor</p>
        </div>
        <Link to="/admin/hospitals/create-hospital" className={styles.createBtn}>
          <MdAdd /> Yangi qo'shish
        </Link>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <MdSearch />
          <input 
            type="text" 
            placeholder="Nomi bo'yicha qidirish..." 
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <div className={styles.selectGroup}>
          <div className={styles.customSelect}><MdLocationOn /><select onChange={(e) => setFilters({...filters, region: e.target.value})}><option value="">Barcha hududlar</option>{regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
          <div className={styles.customSelect}><MdDomain /><select onChange={(e) => setFilters({...filters, department: e.target.value})}><option value="">Barcha bo'limlar</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
        </div>
      </div>

      <div className={styles.listContainer}>
        {loading ? (
          <div className={styles.loader}>Yuklanmoqda...</div>
        ) : filteredHospitals.length > 0 ? (
          filteredHospitals.map(hospital => (
            <div key={hospital.id} className={styles.listItem} onClick={() => navigate(`/admin/hospitals/detail-hospital/${hospital.id}`)}>
              <div className={styles.itemMain}>
                <div className={styles.imageBox}>
                  {hospital.image ? <img src={hospital.image} alt={hospital.name} /> : <MdBusiness />}
                </div>
                <div className={styles.infoBox}>
                  <h3 className={styles.hospName}>{hospital.name}</h3>
                  <p className={styles.hospAddress}>{hospital.address}</p>
                  <div className={styles.metaTags}>
                    <span className={styles.regionTag}><MdLocationOn /> {hospital.region_details.name}</span>
                    <span className={styles.deptTag}><MdLayers /> {hospital.departments?.length || 0} bo'lim</span>
                  </div>
                </div>
              </div>

              <div className={styles.itemDetails}>
                <div className={styles.directorBox}>
                  <MdPeople />
                  <div>
                    <label>Direktor</label>
                    <span>{hospital.director_name || "Tayinlanmagan"}</span>
                  </div>
                </div>
                <div className={styles.arrowBox}>
                  <MdKeyboardArrowRight />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>Muassasa topilmadi</div>
        )}
      </div>
    </div>
  );
};

export default AdminListHospital;
