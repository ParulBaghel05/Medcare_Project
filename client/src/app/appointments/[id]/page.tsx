"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
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
  disease: string[];
}

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/${id}`);
        if (res.data) {
          setDoctor(res.data.doctor);
        } 
        else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !doctor) return <p>Doctor not found</p>;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileLeftSection}>
          <Image
            src="/doctor.svg"
            alt={doctor.name}
            width={250}
            height={250}
            className={styles.profileImage}
          />
          <div className={styles.profileName}>{doctor.name}</div>
        </div>
        <div className={styles.profileRightSection}>
          <div className={styles.profileDetails}>
            <div className={styles.detailSection}>
              <h3>Speciality</h3>
              <div className={styles.speciality}>
                {doctor.speciality}
              </div>
            </div>
            
            <div className={styles.detailSection}>
              <h3>Experience</h3>
              <p>{doctor.experience} Years</p>
            </div>
            
            <div className={styles.detailSection}>
              <h3>Location</h3>
              <p>{doctor.location}</p>
            </div>
            
            <div className={styles.detailSection}>
              <h3>Gender</h3>
              <p>{doctor.gender}</p>
            </div>
            
            <div className={styles.detailSection}>
              <h3>Treated Diseases</h3>
              <p>
                <strong>Treated Diseases:</strong> {Object.entries(doctor.disease)
                  .map(([disease, treatment]) => `${disease} (${treatment})`)
                  .join(", ")}
              </p>
            </div>
            
            <div className={styles.detailSection}>
              <h3>Rating</h3>
              <p>{doctor.rating} ⭐</p>
            </div>
          </div>
          
          <div className={styles.bookSection}>
            <Link className={styles.bookButton} href={`/appointments/${doctor.id}/schedule`}>
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;