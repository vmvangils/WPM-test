import React, { useState } from 'react';
import './LoginRegister.css';

// Definieer een functionele component genaamd LoginRegister.
const LoginRegister: React.FC = () => {
  // isLogin houdt bij of we inloggen of registreren
  const [isLogin, setIsLogin] = useState(true);

  // maakt een var genaamd formData om de invoergegevens van het formulier op te slaan.
  const [formData, setFormData] = useState({
    username: '', 
    password: '', 
    confirmPassword: '' // Dit staat alleen bij registratie
  });

  // Een functie die wordt aangeroepen wanneer het formulier wordt ingediend.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
  };

  // Een functie die wordt aangeroepen wanneer er een verandering plaatsvindt in een invoerveld.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; 
    setFormData(prev => ({
      ...prev, // Kopieer de huidige staat van formData.
      [name]: value // Update het specifieke veld met de nieuwe waarde.
    }));
  };

  return (
    <div className="login-register">
      {/* Container voor het login/register formulier */}
      <div className="form-container">
        {/* Toon "Login" of "Register" afhankelijk van de waarde van isLogin */}
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {/* Het formulier zelf */}
        <form onSubmit={handleSubmit}>
          {/* Invoerveld voor gebruikersnaam */}
          <div className="form-group">
            <label htmlFor="username">Gebruikersnaam</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Invoerveld voor wachtwoord */}
          <div className="form-group">
            <label htmlFor="password">Wachtwoord</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Toon het bevestig wachtwoord veld alleen bij registratie */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Submit knop voor het formulier */}
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Registreer'}
          </button>
        </form>

        {/* Knop om te switchen tussen login en registratie */}
        <button 
          className="toggle-btn"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin 
            ? 'Heb je geen account? Registreer je' 
            : 'Heb je al een account? Log in'
          }
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;