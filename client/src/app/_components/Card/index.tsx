"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";

const DoctorCard = ({ doctor }: { doctor: any }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/appointments/${doctor.id}`);
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardContent} onClick={handleCardClick} role="button" tabIndex={0}>
        <Image src="/doctor.svg" alt="Doctor Image" width={150} height={150} className={styles.doctorImage} />
        <div className={styles.infoSection}>
          <p className={styles.doctorName}>{doctor.name}</p>
          <div className={styles.metaInfo}>
            <p className={styles.speciality}>
              <Image src="/Stethoscope.svg" alt="Speciality Icon" width={18} height={15} />
              <span>{doctor.speciality}</span>
            </p>
            <p className={styles.experience}>
              <Image src="/Hourglass.svg" alt="Experience Icon" width={18} height={15} />
              <span>{doctor.experience} years</span>
            </p>
          </div>
        </div>
        <p className={styles.rating}>
          Ratings:{" "}
          {[...Array(5)].map((_, index) => (
            <span key={index} style={{ color: index < Math.round(doctor.rating) ? "gold" : "#E0E0E0" }}>
              ★
            </span>
          ))}
        </p>
      </div>
      <Link className={styles.bookButton} href={`/appointments/${doctor.id}/schedule`}>
        Book Appointment
      </Link>
    </div>
  );
};

export default DoctorCard;
