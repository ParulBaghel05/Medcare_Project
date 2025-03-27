import Image from "next/image";
import styles from "./index.module.css";
import Link from "next/link";

const DoctorCard = ({ doctor }: { doctor: any }) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardContent}>
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
            {[...Array(5)].map((_, index) => (
                <span key={index} style={{color: index < doctor.ratings ? 'gold' : '#E0E0E0'}}>★</span>
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
