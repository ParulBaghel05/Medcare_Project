"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import DoctorCard from "../_components/Card";
import SideCard from "../_components/SideCard";
import styles from "./page.module.css";
import Loader from "../_components/Loader";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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

const Pagination = ({ currentPage, totalPages, paginate }: { currentPage: number, totalPages: number, paginate: (page: number) => void }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(1);
    if (currentPage > 3) {
      pageNumbers.push("...");
    }
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => paginate(currentPage - 1)} 
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        Previous
      </button>
      {getPageNumbers().map((page, index) => (
        typeof page === "string" ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => paginate(page)}
            className={`${styles.paginationButton} ${currentPage === page ? styles.activePage : ''}`}
          >
            {page}
          </button>
        )
      ))}
      <button 
        onClick={() => paginate(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Next
      </button>
    </div>
  );
};

const AppointmentPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filters, setFilters] = useState({ rating: "", experience: "", gender: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);
  const ratingRef = useRef<{ reset: () => void } | null>(null);
  const experienceRef = useRef<{ reset: () => void } | null>(null);
  const genderRef = useRef<{ reset: () => void } | null>(null);

  const token=Cookies.get("token");

  const router=useRouter();
  useEffect(()=>{
     if(!token)router.push("/login");
  },[])
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/getDoctors`);
        const sortedDoctors = res.data.doctors.sort((a: Doctor, b: Doctor) => b.rating - a.rating);
        setDoctors(sortedDoctors);
        setFilteredDoctors(sortedDoctors.slice(0, 6));
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false); 
        setIsLoading(false); 
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
    setFilteredDoctors(doctors.slice(0, 6));
    setFiltersApplied(false);
    setFilters({ rating: "", experience: "", gender: "All" });
    setCurrentPage(1);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = () => {
    const searchResults = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(searchResults);
    setFilteredDoctors(searchQuery.trim() === "" ? doctors.slice(0, 6) : searchResults);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

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
                setFilteredDoctors(doctors.slice(0, 6));
              }
            }}
            onKeyDown={handleKeyDown}
            />
          <button className={styles.searchButton} onClick={handleSearch}>Search</button>
        </div>
        <h3 className={styles.resultsTitle}>
          {filtersApplied || searchQuery ? `${filteredDoctors.length} doctors available` : "Top 6 rated doctors"}
        </h3>
        <p className={styles.resultsSubtitle}>Book appointments with minimal wait time and verified doctor details</p>
      </section>

      <section className={styles.resultsSection}>
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
            {isLoading && <div style={{height:"100vh"}}>
              <Loader />
            </div>} 
            <div className={styles.doctorList}>
              {currentDoctors.length === 0 ? (
                <p>No doctors found.</p>
              ) : (
                currentDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
              )}
            </div>

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              paginate={paginate}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;
