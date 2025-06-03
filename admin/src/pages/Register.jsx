import React from 'react'
import AuthenTemplate from '../components/authen-template'
import Navbar_authen from '../navbar-authen/Navbar-authen'

function Register() {
  return (
    <>
      <Navbar_authen />
      < AuthenTemplate isLogin={false} ></AuthenTemplate>
    </>
  )
}

export default Register