import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
// React.FC literally just means React.FunctionComponent, it's literally just to tell react that this is a react function component.
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
        {/* // This will see if the menu is open */}
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
            </div>
            {/* // This will show the menu */}
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" onClick={closeMenu}>TypeTest</Link>
                <Link to="/history" onClick={closeMenu}>History</Link>
                {/* // This will show the user info */}
                {user ? (
                    <div className="user-section">
                        <div className="user-info">Logged in as: {user.username}</div>
                        <button className="logout-button" onClick={handleLogout}>
                           Logout
                        </button>
                    </div>
                ) : (
                    <>
                    // this will show the login/Register button
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                        <Link to="/register" onClick={closeMenu}>Register</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default SideMenu; 