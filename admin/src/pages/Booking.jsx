import React from 'react'
import Footer from '../components/footer/Footer'
import Navbar from '../components/navbar/Navbar'
import BookingCoach from '../components/bookings/BookingCoach'
import BannerSingle from '../components/banner/BannerSingle'

function Booking() {
  return (
    <>
        <Navbar />
        <BannerSingle />
        <BookingCoach />
        <Footer />
    </>
  )
}

export default Booking