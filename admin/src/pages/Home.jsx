import React from "react";
import Navbar from "../components/navbar/Navbar";

import BannerSlider from "../components/banner/BannerSlide";
import Footer from "../components/footer/Footer";

function Home() {
    return (
        <div>
            <Navbar />
            <BannerSlider />
            <Footer/>
        </div>
    );
}

export default Home;