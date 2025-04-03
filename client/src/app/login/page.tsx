"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import styles from "./page.module.css";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("user")) {
      router.replace("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(email,password);
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/auth/login`, {
        email,
        password,
      });
      const userData=data.userData;
      toast.success("Logged in successfully!", { position: "top-right" });
      Cookies.set("user",JSON.stringify(data.userData.user));
      Cookies.set("token",data.userData.token);
      router.push("/appointments");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed!";
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className={styles.login}>
        <div className={styles["bg-img"]}></div>
        <section className={styles["lgn-page"]}>
          <h2>Login</h2>
          <div>
            Are you a new member?{" "}
            <Link href="/signup" className={styles.link}>
              Sign up here.
            </Link>
          </div>
          <form className={styles["login-form"]} onSubmit={handleSubmit}>
            <div className={styles["email-input"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="emmawatson@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles["password-input"]}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles["login-btns"]}>
              <button type="submit" className={styles["lgn-btn"]} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="reset"
                className={styles["rst-btn"]}
                onClick={() => {
                  setEmail("");
                  setPassword("");
                }}
              >
                Reset
              </button>
              <button className= {styles["glgn-btn"]} onClick={()=>window.location.href=`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/auth/google`}>Login with Google</button>
            </div>
          </form>
          <div className={styles["frgt"]}>
            <Link href="/forgot-password" className={styles.link}>
              Forgot Password?
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
