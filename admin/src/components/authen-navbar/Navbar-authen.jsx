import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import './Navbar-authen.css'; // Assuming you have a CSS file for styling

function Navbar_authen() {
    return (
        <nav className="auth-navbar">
            <div className="auth-navbar-left">
                <Link to="/" className="auth-logo-link">
                    <img src={logo} alt="Quit Care Logo" className="auth-logo" />
                    <div className="auth-brand-text">
                        <div>QUIT</div>
                        <div>CARE</div>
                    </div>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar_authen