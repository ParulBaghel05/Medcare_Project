"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import styles from "./page.module.css";
import Cookies from "js-cookie";

const Signup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("user")) {
      router.replace("/");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user.email.endsWith("@gmail.com")) {
        toast.info("Enter a valid Gmail address");
        setIsLoading(false);
        return;
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/auth/register`, user);


      console.log("Signup response:", res.data);

      if (res.status === 201 && res.data.success) {
        toast.success("Signed up successfully! Redirecting to login...");
        router.push("/login");
      } else {
        throw new Error(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.signup}>
      <div className={styles["bg-img"]}></div>
      <section className={styles["sgnp-page"]}>
        <h2>Sign Up</h2>
        <div>
          Already a member? <Link href="/login">Login</Link>
        </div>

        <form className={styles["signup-form"]} onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["signup-btns"]}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Submit"}
            </button>
            <button
              type="reset"
              onClick={() => setUser({ name: "", email: "", password: "" })}
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </form>

        <div className={styles.frgt}>
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
      </section>
    </main>
  );
};

export default Signup;
