import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// --- Import your page components ---
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Home from './Pages/Home/Home';
import Profile from "./Pages/Profile/Profile";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Your auth logic here
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <>
      {/* This Router handles all navigation for the app */}
      <Router>
        <Routes>
          {/* Public routes for authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* A catch-all route that redirects any unknown URL to the main page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

      {/* The ToastContainer from react-toastify listens for toast() calls anywhere in the app */}
      <ToastContainer
        position="bottom-right" // A common position for chat apps
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Dark theme matches the Gemini UI
      />
    </>
  );
}
