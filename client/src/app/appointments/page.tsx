"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import data from "@/data/data.json";
import DoctorCard from "../_components/Card";
import SideCard from "../_components/SideCard";
import styles from "./page.module.css";

const AppointmentPage = () => {
  const [filteredDoctors, setFilteredDoctors] = useState(data);
  const ratingRef = useRef<{ reset: () => void } | null>(null);
  const experienceRef = useRef<{ reset: () => void } | null>(null);
  const genderRef = useRef<{ reset: () => void } | null>(null);

  const applyFilter = (category: string, value: string) => {
    let updatedDoctors = data;

    switch (category) {
      case "rating":
        updatedDoctors = updatedDoctors.filter((doc) => doc.ratings >= Number(value[0]));
        break;
      case "experience":
      case "gender":
        break;
    }
    setFilteredDoctors(updatedDoctors);
  };

  const resetFilters = () => {
    ratingRef.current?.reset();6
    experienceRef.current?.reset();
    genderRef.current?.reset();
    setFilteredDoctors(data);
  };

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h2 className={styles.title}>Find a doctor at your own ease</h2>
        <div className={styles.searchWrapper}>
          <Image src="/searchicon.svg" alt="Search Icon" width={20} height={20} className={styles.searchIcon} />
          <input type="text" placeholder="Search for doctors" className={styles.searchInput} />
          <button className={styles.searchButton}>Search</button>
        </div>
      </section>

      <section className={styles.resultsSection}>
        <h3 className={styles.resultsTitle}>{filteredDoctors.length} doctors available</h3>
        <p className={styles.resultsSubtitle}>Book appointments with minimal wait time and verified doctor details</p>

        <div className={styles.contentWrapper}>
          <aside className={styles.sidebar}>
            <div className={styles.filterHeader}>
              <span>Filter By:</span>
              <button onClick={resetFilters} className={styles.resetButton}>Reset</button>
            </div>
            <SideCard title="Rating" data={["1 star", "2 star", "3 star", "4 star", "5 star"]} handleFilter={applyFilter} ref={ratingRef} />
            <SideCard title="Experience" data={["15+ years", "10-15 years", "5-10 years", "3-5 years", "1-3 years", "0-1 years"]} handleFilter={applyFilter} ref={experienceRef} />
            <SideCard title="Gender" data={["All", "Male", "Female"]} handleFilter={applyFilter} ref={genderRef} />
          </aside>
          <div className={styles.doctorList}>
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;
