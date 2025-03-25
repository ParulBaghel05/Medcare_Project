import Image from "next/image";
import styles from "./page.module.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Landing from "./landing/page";
import Login from "./login/page";
import Signup from "./signup/page";
import Schedule from "./appointments/[id]/schedule/page";

export default function Home() {
  return (
    <>
      {/* <Header/> */}
      {/* <Landing/> */}
      {/* <Login/> */}
      {/* <Signup/> */}
      {/* <Footer/> */}
      <Schedule/>
    </>  
    );
}
