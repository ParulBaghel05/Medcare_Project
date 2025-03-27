"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import DoctorCard from "../_components/Card";
import SideCard from "../_components/SideCard";
import styles from "./page.module.css";

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  photo_url: string;
  rating: number;
  location: string;
  gender: "Male" | "Female" | "Other";
}

const AppointmentPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const ratingRef = useRef<{ reset: () => void } | null>(null);
  const experienceRef = useRef<{ reset: () => void } | null>(null);
  const genderRef = useRef<{ reset: () => void } | null>(null);

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/getDoctors`);
          setDoctors(res.data);
          setFilteredDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const applyFilter = (category: string, value: string) => {
    let updatedDoctors = doctors;

    switch (category) {
      case "rating":
        updatedDoctors = updatedDoctors.filter((doc) => doc.rating >= Number(value[0]));
        break;
      case "experience":
        updatedDoctors = updatedDoctors.filter((doc) => {
          const exp = doc.experience;
          if (value === "15+ years") return exp >= 15;
          if (value === "10-15 years") return exp >= 10 && exp < 15;
          if (value === "5-10 years") return exp >= 5 && exp < 10;
          if (value === "3-5 years") return exp >= 3 && exp < 5;
          if (value === "1-3 years") return exp >= 1 && exp < 3;
          return exp < 1;
        });
        break;
      case "gender":
        if (value !== "All") updatedDoctors = updatedDoctors.filter((doc) => doc.gender === value);
        break;
    }

    setFilteredDoctors(updatedDoctors);
  };

  const resetFilters = () => {
    ratingRef.current?.reset();
    experienceRef.current?.reset();
    genderRef.current?.reset();
    setFilteredDoctors(doctors);
  };

  if (loading) return <p>Loading doctors...</p>;
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
            {filteredDoctors.length === 0 ?(doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))):(filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            )))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;
