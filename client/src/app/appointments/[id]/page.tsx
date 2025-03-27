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
          setDoctor(res.data);
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
        <Image
          src={doctor.photo_url}
          alt={doctor.name}
          width={150}
          height={150}
          className={styles.profileImage}
        />
        <h2>{doctor.name}</h2>
        <p><strong>Speciality:</strong> {doctor.speciality}</p>
        <p><strong>Experience:</strong> {doctor.experience} years</p>
        <p><strong>Rating:</strong> {doctor.rating} ⭐</p>
        <p><strong>Location:</strong> {doctor.location}</p>
        <p><strong>Gender:</strong> {doctor.gender}</p>
        <p>
        <strong>Treated Diseases:</strong> {Object.entries(doctor.disease)
          .map(([disease, treatment]) => `${disease} (${treatment})`)
          .join(", ")}
        </p>

        <Link className={styles.bookButton} href={`/appointments/${doctor.id}/schedule`}>
        Book Appointment
      </Link>
      </div>
    </div>
  );
};

export default DoctorProfile;
