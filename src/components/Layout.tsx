import React from "react";

import Footer from "./Footer/Footer";
import { Header } from "./Header/Header";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Header/>
      <main>{children}</main>
      <Footer/>
    </div>
  );
}
