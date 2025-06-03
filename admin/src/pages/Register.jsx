import React from 'react'
import AuthenTemplate from '../components/authen-template'
import Navbar from '../components/navbar/Navbar'
import Navbar_authen from '../components/authen-navbar/Navbar-authen'

function Register() {
  return (
    <>
      <Navbar_authen />
      < AuthenTemplate isLogin={false} ></AuthenTemplate>
    </>
  )
}

export default Register