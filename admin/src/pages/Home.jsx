import React from "react";
import Navbar from "../components/navbar/Navbar";
import BannerSlider from "../components/banner/BannerSlide";
import Footer from "../components/footer/Footer";
import AboutUs from "../components/about-us/AboutUs";
import MemberCommparision from "../components/compare-membership/CompareMs";
import Package from "../components/package-user/package";

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <section className="banner-section">
        <BannerSlider />
      </section>
      <section className="about-section">
        <AboutUs />
      </section>
      <section className="package-section">
        <Package />
      </section>
      <section className="compare-section">
        <MemberCommparision />
      </section>
      <section className="footer-section">
        <Footer />
      </section>
    </div>
  );
}

export default Home;
