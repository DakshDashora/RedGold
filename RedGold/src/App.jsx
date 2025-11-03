import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";


import Navbar from "./Navbar";
import Footer from "./Footer";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import DonorDashboard from "./Pages/DonorDashboard";
import ReceiverDashboard from "./Pages/ReceiverDashboard";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
       
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        

     
        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/receiver-dashboard"
          element={
            <ProtectedRoute>
              <ReceiverDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />*/}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes> 
      <Footer />
    </>
  );
}

export default App;
