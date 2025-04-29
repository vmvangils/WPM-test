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

// Protected route for things tat require auth.
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
// logs if the user is authenticated or not.
  console.log(`[PrivateRoute] Rendering: loading=${loading}, isAuthenticated=${isAuthenticated}`);

  // Shows nothing while loading, PrivateRoute is the protected route on line 12.
  if (loading) {
    console.log('[PrivateRoute] Auth check in progress, showing loading...');
    return null;
  }

  // Sends the user to login before they can start a typetest.
  if (!isAuthenticated) {
    console.log('[PrivateRoute] Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
// Logs if the user is authenticated. 
  console.log('[PrivateRoute] Authenticated, rendering children');
  return <>{children}</>;
};

// dit is het hoofdcomponent van de applicatie, React.FC is a function component that literally just tells React that this is react.
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