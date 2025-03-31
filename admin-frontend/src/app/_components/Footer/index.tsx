import Image from "next/image";
import styles from "./index.module.css";

export default function Footer(){
    return(
        <footer className={styles.footer}>
            <p className={styles.content}>
              © EmScripts 2024. All Right Reserved.
            </p>
            <div className={styles.contactsection}>
                <Image src="/Phone.svg" alt="contact" width={20} height={20}/>
                <Image src="/WhatsApp.svg" alt="contact" width={20} height={20}/>
            </div>
        </footer>
    )
}