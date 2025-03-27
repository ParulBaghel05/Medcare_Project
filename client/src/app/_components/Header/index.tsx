"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";

const Header = () => {
  return (
    <header className={styles.nav}>
      <div className={styles["nav-1"]}>
        <div className={styles.med}>
          <Image src="/frame.svg" alt="MedCare Logo" width={40} height={40} />
          <h3><div>MedCare</div></h3>
        </div>
        <nav className={styles.anchors}>
          <Link href="/" className={styles["nav-link"]}>Home</Link>
          <Link href="/appointments" className={styles["nav-link"]}>Appointments</Link>
          <Link href="/blog" className={styles["nav-link"]}>Health Blog</Link>
          <Link href="/reviews" className={styles["nav-link"]}>Reviews</Link>
        </nav>
      </div>
      <div className={styles["nav-2"]}>
        <Link href="/login" className={styles["login-btn"]}>Login</Link>
        <Link href="/signup" className={styles["reg-btn"]}>Register</Link>
      </div>
    </header>
  );
};

export default Header;
