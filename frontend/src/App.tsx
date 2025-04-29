import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SideMenu from './components/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import History from './components/History';
import Leaderboard from './components/Leaderboard';
import './App.css';

// dit is een component voor beschermde routes die authenticatie vereisen
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log(`[PrivateRoute] Rendering: loading=${loading}, isAuthenticated=${isAuthenticated}`);

  // toon niets tijdens het laden
  if (loading) {
    console.log('[PrivateRoute] Auth check in progress, showing loading...');
    return null;
  }

  // redirect naar login als de gebruiker niet is ingelogd
  if (!isAuthenticated) {
    console.log('[PrivateRoute] Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('[PrivateRoute] Authenticated, rendering children');
  return <>{children}</>;
};

// dit is het hoofdcomponent van de applicatie
const App: React.FC = () => {
  return (
    // wrap de hele app in de AuthProvider voor authenticatie
    <AuthProvider>
      <Router>
        <div className="App">
          {/* navigatie menu */}
          <SideMenu />
          {/* routes voor verschillende pagina's */}
          <Routes>
            {/* home route - beschermd */}
            <Route path="/" element={
              <PrivateRoute>
                 <Home />
              </PrivateRoute>
            } />
            {/* login route - publiek */}
            <Route path="/login" element={<Login />} />
            {/* registratie route - publiek */}
            <Route path="/register" element={<Register />} />
            {/* geschiedenis route - beschermd */}
            <Route path="/history" element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } />
            {/* leaderboard route - publiek */}
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 