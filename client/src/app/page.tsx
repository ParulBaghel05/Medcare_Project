// import Image from "next/image";
// import styles from "./page.module.css";
// import Header from "./_components/Header";
// import Footer from "./_components/Footer";
// import Landing from "./landing/page";
// import Login from "./login/page";
// import Signup from "./signup/page";
// import Schedule from "./appointments/[id]/schedule/page";

// export default function Home() {
//   return (
//     <>
//       {/* <Header/> */}
//       {/* <Landing/> */}
//       {/* <Login/> */}
//       {/* <Signup/> */}
//       {/* <Footer/> */}
//       {/* <Schedule/> */}
//     </>  
//     );
// }

import Image from "next/image";
import styles from "./page.module.css";    

const Landing = () => {
  return (
    <>
      <main className={styles.main}>
        <section className={styles["main-1"]}>
          <h1 className={styles["heading-text"]}>Health in Your Hands.</h1>
          <p className={styles["main-text"]}>
            Take control of your healthcare with CareMate. Book appointments with ease, 
            explore health blogs, and stay on top of your well-being, all in one place.
          </p>
          <div className={styles["get-btn"]}>
            <button className={styles["st-btn"]}>Get Started</button>
          </div>
        </section>

        <section className={styles["main-2"]}>
        <Image 
            src="/l1.svg" 
            alt="Healthcare Professional" 
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles["main-2-img"]}
          />
        </section>
      </main>
    </>
  );
};

export default Landing;