import React from "react";
import Navbar from "../components/navbar/Navbar";

import BannerSlider from "../components/banner/BannerSlide";
import Footer from "../components/footer/Footer";
import AboutUs from "../components/about-us/AboutUs";
import MemberCommparision from "../components/compare-membership/CompareMs";
import Package from "../components/package-user/package";
function Home() {
    return (
        <div>
            <Navbar />
            <BannerSlider />
            <AboutUs />
            <Package/>
            <MemberCommparision />
            <Footer />
        </div>
    );
}

export default Home;