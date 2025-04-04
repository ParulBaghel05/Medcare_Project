"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { JwtPayload } from "jsonwebtoken";
import { useEffect, useState } from "react";
import { LogOutIcon } from "lucide-react";

interface jwt extends JwtPayload {
  email: string;
  id: number;
  name: string;
  role: string;
}

export default function Header() {
  const [payload, setPayload] = useState<jwt | null>(null);
  const router = useRouter();
  const token = Cookies.get("token"); 
  const username = Cookies.get("username"); 

  

  useEffect(() => {
    
    if (!token || !username) return;
    const tokenData = jwt.decode(token as string) as jwt;
    if (!tokenData) return;
    console.log(tokenData);
    setPayload(tokenData);
    // window.location.reload()
  }, [token,username]);

  return (
    <header className={styles.container}>
      <div className={styles.subcontainer}>
        <div
          className={styles.titleContainer}
          onClick={() => router.push("/")}
        >
          <Image src="/logo.svg" alt="medcare-logo" width={36} height={36} />
          <p className={styles.title}>MedCare</p>
        </div>
      </div>
      <div className={styles.buttonContainer} onClick={() => {
                Cookies.remove("username");
                Cookies.remove("token")
                setPayload(null);
                router.push("/login");
              }}>
        <Link
          className={styles.buttons}
          href={"/login"}
        >
          {payload ? `Hi, ${username as string} ` : `Login`}
          {username && (
            <LogOutIcon/>
          )}
        </Link>
      </div>
    </header>
  );
}