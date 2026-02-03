import React from "react";
import Hero from "../components/Hero";
import WhoItsFor from "../components/WhoItsFor";
import Problems from "../components/Problems";
import HowItWorks from "../components/HowItWorks";
import Security from "../components/Security";
import CTA from "../components/CTA";
import Navbar from "../components/Navbar";
import "../styles/global.css";


const Landing = () => {
  return (
    <>
    <Navbar />
      <Hero />
      <WhoItsFor />
      <Problems />
      <HowItWorks />
      <Security />
      <CTA />
    </>
  );
};

export default Landing;
