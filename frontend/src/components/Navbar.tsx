import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <li className="nav-logo">
        <a href="/">
          <img src="/icons/logo.png" alt="Home" />
          AREA
        </a>
      </li>
      <ul>
        {/* Orders - Visible only to admins */}
        {user?.role === "admin" && (
          <li className="nav-item" id="ordersLink">
            <a href="/orders">
              <img src="/icons/orders.png" alt="Orders" />
              Orders
            </a>
          </li>
        )}

        {/* Items - Visible only to admins */}
        {user?.role === "admin" && (
          <li className="nav-item" id="itemsLink">
            <a href="/items">
              <img src="/icons/items.png" alt="Items" />
              Items
            </a>
          </li>
        )}

        {/* Statistics - Visible only to admins */}
        {user?.role === "admin" && (
          <li className="nav-item" id="statisticsLink">
            <a href="/statistics">
              <img src="/icons/group.png" alt="Statistics" />
              Statistics
            </a>
          </li>
        )}

        {/* Authentication Status */}
        {isAuthenticated ? (
          <li>
            <a href="#" onClick={handleLogout} id="authStatus">
              <img src="/icons/logout.png" alt="Logout" />
              Logout
            </a>
          </li>
        ) : (
          <li>
            <a href="/login" id="authStatus">
              <img src="/icons/login.png" alt="Login" />
              Login
            </a>
          </li>
        )}

        {/* Cart */}
        <li>
          <a href="/cart">
            <img src="/icons/cart.png" alt="Cart" />
            Cart
          </a>
        </li>
        <li>
          <span className="cartItemCountDisplay" id="cartItemCount"></span>
        </li>
      </ul>

      {/* Search Bar */}
      <div role="search" aria-label="Site Search">
        <form method="get" action="/search_results.html" className="search-bar" id="searchForm">
          <input
            type="text"
            name="query"
            placeholder="Search..."
            aria-label="Search Input"
            className="searchInput"
            id="searchInput"
          />
          <div className="tooltip-container">
            <button type="submit" aria-label="Submit Search" className="searchButton" id="searchButton">
              <img src="/icons/search.png" alt="Search" />
            </button>
            <span className="tooltip-text">Search</span>
          </div>
          <div className="tooltip-container">
            <a href="/search_advanced.html" className="advanced-search-button" aria-label="Advanced Search">
              <img src="/icons/searchAdv.png" alt="Advanced Search" />
            </a>
            <span className="tooltip-text">Advanced Search</span>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;