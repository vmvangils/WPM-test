import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const SideMenu: React.FC = () => {
    // maakt een var aan genaamd isMenuOpen om bij te houden of de menu open is
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // maakt een var aan genaamd user om de ingelogde gebruiker op te slaan
    const { user, logout } = useAuth();
    // maakt een functie aan genaamd toggleMenu om de menu open te zetten
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <>
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
            </div>

            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" onClick={closeMenu}>TypeTest</Link>
                <Link to="/history" onClick={closeMenu}>History</Link>

                {user ? (
                    <div className="user-section">
                        <div className="user-info">Logged in as: {user.username}</div>
                        <button className="logout-button" onClick={handleLogout}>
                           Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                        <Link to="/register" onClick={closeMenu}>Register</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default SideMenu; 