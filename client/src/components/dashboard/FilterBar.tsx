import styles from './FilterBar.module.css';

export default function FilterBar() {
  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <span className={styles.label}>Filter By</span>
        <div className={styles.pillContainer}>
          <select className={styles.pillSelect}>
            <option>All Classes</option>
            <option>Class 5th</option>
            <option>Class 8th</option>
            <option>Class 10th</option>
          </select>
          <select className={styles.pillSelect}>
            <option>All Subjects</option>
            <option>English</option>
            <option>Science</option>
            <option>Mathematics</option>
          </select>
        </div>
      </div>
      
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search assignments..." 
            className={styles.searchInput}
          />
        </div>
      </div>
    </div>
  );
}
