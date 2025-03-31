"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const userToken = Cookies.get("user");
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles["nav-1"]}>
        <div className={styles.med}>
          <Image src="/frame.svg" alt="MedCare Logo" width={40} height={40} />
          <h3>MedCare</h3>
        </div>
        
        <div className={styles["menu-toggle"]} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div className={`${styles.anchors} ${menuOpen ? styles.active : ""}`}>
        <Link href="/" className={styles["nav-link"]}>
          Home
        </Link>
        <Link href="/appointments" className={styles["nav-link"]}>
          Appointments
        </Link>
        <Link href="/blog" className={styles["nav-link"]}>
          Health Blog
        </Link>
        <Link href="/reviews" className={styles["nav-link"]}>
          Reviews
        </Link>
      </div>
      
      <div className={`${styles["nav-2"]} ${menuOpen ? styles.active : ""}`}>
        {isMounted && (
          <>
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <button className={styles["login-btn"]}>Login</button>
                </Link>
                <Link href="/register">
                  <button className={styles["reg-btn"]}>Register</button>
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className={styles["reg-btn"]}>
                Logout
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;