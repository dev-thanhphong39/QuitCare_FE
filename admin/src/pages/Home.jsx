import React from "react";
import Navbar from "../components/navbar/Navbar";

import BannerSlider from "../components/banner/BannerSlide";
import Footer from "../components/footer/Footer";
import AboutUs from "../components/about-us/AboutUs";
import MemberCommparision from "../components/compare-membership/CompareMs";
function Home() {
    return (
        <div>
            <Navbar />
            <BannerSlider />
            <AboutUs />
            <MemberCommparision />
            <Footer />
        </div>
    );
}

export default Home;