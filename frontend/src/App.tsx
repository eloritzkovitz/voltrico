import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />          
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;