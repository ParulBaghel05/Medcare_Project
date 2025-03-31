import Header from "./_components/Header";
import Footer from "./_components/Footer";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "600"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Header />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
