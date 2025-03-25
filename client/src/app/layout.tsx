// import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import "./globals.css";

import { Montserrat} from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "600"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Header/>{children}<Footer/></body>
    </html>
  );
}
