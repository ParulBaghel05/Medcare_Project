"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import DoctorCard from "../_components/Card";
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

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res: any = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/getDoctors`);
        const sortedDoctors = res.data.doctors.sort((a: Doctor, b: Doctor) => b.rating - a.rating);
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

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const generatePaginationNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 3; 
    
    if (totalPages <= maxPageNumbersToShow + 2) {
    
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      if (currentPage <= maxPageNumbersToShow) {
        
        for (let i = 2; i <= maxPageNumbersToShow + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage > totalPages - maxPageNumbersToShow) {
       
        pageNumbers.push('ellipsis');
        for (let i = totalPages - maxPageNumbersToShow; i < totalPages; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages);
      } else {
        
        pageNumbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

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
        <div className={styles.contentWrapper}>
          <div className={styles.doctorListContainer}>
            <div className={styles.doctorList}>
              {currentDoctors.length === 0 ? (
                <p>No doctors found.</p>
              ) : (
                currentDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
              )}
            </div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                
                {generatePaginationNumbers().map((pageNumber, index) => 
                  pageNumber === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>...</span>
                  ) : (
                    <button
                      key={`page-${pageNumber}`}
                      onClick={() => paginate(pageNumber as number)}
                      className={`${styles.paginationButton} ${currentPage === pageNumber ? styles.activePage : ''}`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
                
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;