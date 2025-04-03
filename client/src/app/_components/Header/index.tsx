"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";



const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/appointments", name: "Appointments" },
    { path: "/blog", name: "Health Blog" },
    { path: "/reviews", name: "Reviews" },
  ];
   const router=useRouter();
   const userData=Cookies.get("user");
   let finalUser=null;
   if(userData){
        const parsedData=encodeURI(userData);
        finalUser=JSON.stringify(parsedData);
   }

  useEffect(() => {
    setIsMounted(true);
    const userToken = Cookies.get("user");
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    router.push("/login")
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  //@ts-ignore
  const isActive = (path) => {
    return pathname === path;
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
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            href={link.path} 
            className={`${styles["nav-link"]} ${isActive(link.path) ? styles["active-link"] : ""}`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      
      <div className={`${styles["nav-2"]} ${menuOpen ? styles.active : ""}`}>
        {isMounted && (
          <>
            {!finalUser ? (
              <>
                <Link href="/login">
                  <button className={styles["login-btn"]}>Login</button>
                </Link>
                <Link href="/signup">
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