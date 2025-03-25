import styles from "./page.module.css";

const Appointment = () => {
  return (
    <main className={styles.main}>
      <h2>Find a doctor at your own ease</h2>
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search doctors" className={styles.searchInput} />
        <button className={styles.searchBtn}>Search</button>
      </div>
    </main>
  );
};

export default Appointment;
