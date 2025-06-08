import React from "react";
import Navbar from "../components/navbar/Navbar";

import BannerSlider from "../components/banner/BannerSlide";
import Footer from "../components/footer/Footer";
import AboutUs from "../components/about-us/AboutUs";

function Home() {
    return (
        <div>
            <Navbar />
            <BannerSlider />
            <AboutUs />
            <Footer />
        </div>
    );
}

export default Home;