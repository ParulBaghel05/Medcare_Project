import Image from "next/image";
import styles from "./page.module.css"; 
import Link from "next/link"; 

const Signup = () => {
  return (
    <>
      <main className={styles.signup}>
        <div className={styles["bg-img"]}></div>
        <section className={styles["sgnp-page"]}>
          <h2>Sign Up</h2>
          <div>
            Already a member? <Link href="/login">Login</Link>
          </div>
    
          <form className={styles["signup-form"]}>
            <div className={styles["input-group"]}>
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter your name" 
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
                required 
              />
            </div>
    
            <div className={styles["signup-btns"]}>
              <button type="submit">Submit</button>
              <button type="reset">Reset</button>
            </div>
          </form>
    
          <div className={styles.frgt}>
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default Signup;