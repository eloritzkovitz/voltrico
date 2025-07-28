import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SearchResults from "./pages/SearchResults";
import Orders from "./pages/Orders";
import Items from "./pages/Products";
import Statistics from "./pages/Statistics";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import NotFoundPage from "./components/NotFoundPage";

const App: React.FC = () => {
  const googleClientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || "";

  if (!googleClientId) {
    console.error(
      "Google Client ID is not defined. Please check your .env file."
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app-container">
              <Navbar />
              <div className="page-content">
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/items" element={<Items />} />                  
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
