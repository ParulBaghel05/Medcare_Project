import Link from "next/link";
import styles from "./page.module.css";

const Login = () => {
  return (
    <>
      <main className={styles.login}>
        <div className={styles["bg-img"]}></div>
        <section className={styles["lgn-page"]}>
          <h2>Login</h2>
          <div>
            Are you a new member?{" "}
            <Link href="/register" className={styles.link}>
              Sign up here.
            </Link>
          </div>
          <form className={styles["login-form"]}>
            <div className={styles["email-input"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="emmawatson@gmail.com"
                required
              />
            </div>
            <div className={styles["password-input"]}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
              />
            </div>
            <div className={styles["login-btns"]}>
              <button type="submit" className={styles["lgn-btn"]}>
                Login
              </button>
              <button type="reset" className={styles["rst-btn"]}>
                Reset
              </button>
            </div>
          </form>
          <div className={styles["frgt"]}>
            <Link href="/forgot-password" className={styles.link}>
              Forgot Password ?
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;