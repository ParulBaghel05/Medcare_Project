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
  gender: "MALE" | "FEMALE" | "OTHER";
}

const AppointmentPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filters, setFilters] = useState({ rating: "", experience: "", gender: "All" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);

  const ratingRef = useRef<{ reset: () => void } | null>(null);
  const experienceRef = useRef<{ reset: () => void } | null>(null);
  const genderRef = useRef<{ reset: () => void } | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/getDoctors`);
        const sortedDoctors = res.data.sort((a: Doctor, b: Doctor) => b.rating - a.rating);
        setDoctors(sortedDoctors);
        setFilteredDoctors(sortedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const applyFilter = () => {
    let updatedDoctors = searchResults.length > 0 ? [...searchResults] : [...doctors];

    if (filters.rating) {
      updatedDoctors = updatedDoctors.filter((doc) => doc.rating === parseInt(filters.rating));
    }
    if (filters.experience) {
      updatedDoctors = updatedDoctors.filter((doc) => {
        const exp = doc.experience;
        if (filters.experience === "15+ years") return exp >= 15;
        if (filters.experience === "10-15 years") return exp >= 10 && exp < 15;
        if (filters.experience === "5-10 years") return exp >= 5 && exp < 10;
        if (filters.experience === "3-5 years") return exp >= 3 && exp < 5;
        if (filters.experience === "1-3 years") return exp >= 1 && exp < 3;
        return exp < 1;
      });
    }
    if (filters.gender !== "All") {
      updatedDoctors = updatedDoctors.filter((doc) => doc.gender === filters.gender.toUpperCase());
    }

    setFilteredDoctors(updatedDoctors);
    setFiltersApplied(true);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    ratingRef.current?.reset();
    experienceRef.current?.reset();
    genderRef.current?.reset();
    setFilteredDoctors(doctors);
    setFiltersApplied(false);
    setFilters({ rating: "", experience: "", gender: "All" });
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const searchResults = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(searchResults);
    setFilteredDoctors(searchQuery.trim() === "" ? doctors : searchResults);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h2 className={styles.title}>Find a doctor at your own ease</h2>
        <div className={styles.searchWrapper}>
          <Image src="/searchicon.svg" alt="Search Icon" width={20} height={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for doctors"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() === "") {
                setFilteredDoctors(doctors);
              }
            }}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.searchButton} onClick={handleSearch}>Search</button>
        </div>
      </section>

      <section className={styles.resultsSection}>
        <h3 className={styles.resultsTitle}>{filteredDoctors.length} doctors available</h3>
        <p className={styles.resultsSubtitle}>Book appointments with minimal wait time and verified doctor details</p>

        <div className={styles.contentWrapper}>
          <aside className={styles.sidebar}>
            <div className={styles.filterHeader}>
              <span>Filter By:</span>
              <button onClick={filtersApplied ? resetFilters : applyFilter} className={styles.applyButton}>
                {filtersApplied ? "Reset" : "Apply"}
              </button>
            </div>
            <SideCard title="Rating" data={["1", "2", "3", "4", "5"]} handleFilter={(category, value) => setFilters((prev) => ({ ...prev, rating: value }))} ref={ratingRef} />
            <SideCard title="Experience" data={["15+ years", "10-15 years", "5-10 years", "3-5 years", "1-3 years", "0-1 years"]} handleFilter={(category, value) => setFilters((prev) => ({ ...prev, experience: value }))} ref={experienceRef} />
            <SideCard title="Gender" data={["All", "Male", "Female"]} handleFilter={(category, value) => setFilters((prev) => ({ ...prev, gender: value }))} ref={genderRef} />
          </aside>
          
          <div className={styles.doctorListContainer}>
            <div className={styles.doctorList}>
              {currentDoctors.length === 0 ? (
                <p>No doctors found.</p>
              ) : (
                currentDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
              )}
            </div>

            {/* Pagination Controls */}
            <div className={styles.pagination}>
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;