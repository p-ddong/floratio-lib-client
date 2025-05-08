import React, { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Footer/>
    </div>
  );
}
