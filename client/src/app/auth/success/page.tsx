"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function Success() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [timer, setTimer] = useState(10);

  let timeCounter: NodeJS.Timeout | null = null;

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");
    if (!token || !user) {
      router.push("/login");
      return;
    }
    Cookies.set("token", token);
    Cookies.set("user", user);

    if (timeCounter) clearTimeout(timeCounter);
    let interval = setInterval(() => {
      setTimer((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  return (
    <main className={styles.container}>
      <h2>Google Authentication Successfull</h2>
      <h4>Redirecting in {timer} seconds...</h4>
    </main>
  );
}