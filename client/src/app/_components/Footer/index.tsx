"use client";
import Image from "next/image";
import styles from "./index.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles["footer-content"]}>© EmScripts 2024. All Rights Reserved.</div>
            <div className={styles["footer-img"]}>
                <Image src="/Phone.svg" alt="Phone Icon" width={24} height={24} />
                <Image src="/WhatsApp.svg" alt="WhatsApp Icon" width={24} height={24} />
            </div>
        </footer>
    );
};

export default Footer;