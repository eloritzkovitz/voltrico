import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping, faUser, faSignOutAlt, faBox, faShoppingBag, faChartBar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import itemService from "../services/item-service";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle logout and redirect to login page
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Handle search input change and fetch results
  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const results = await itemService.getItemsByQuery(query);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setShowDropdown(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  // Handle search input blur to hide dropdown after a delay
  const handleSearchBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Toggle profile dropdown visibility
  const toggleProfileDropdown = () => {
    setProfileDropdown((prev) => !prev);
  };

  // Close profile dropdown
  const closeProfileDropdown = () => {
    setProfileDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <Link to="/">
          <img src="/icons/logo.png" alt="Home" className="logo-img" />
        </Link>
      </div>
  
      {/* Search Bar */}
      <form
        role="search"
        aria-label="Site Search"
        className="search-bar"
        onSubmit={handleSearchSubmit}
      >
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            name="query"
            placeholder="Search..."
            aria-label="Search Input"
            className="searchInput"
            id="searchInput"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
          />
        </div>
        {showDropdown && searchResults.length > 0 && (
          <div className="search-dropdown">
          {searchResults.map((result) => (
            <Link
              key={result._id}
              to={`/items/${result._id}`}
              className="search-result-item d-flex align-items-center gap-2"
              onClick={() => setShowDropdown(false)}
            >
              <img
                src={result.imageUrl || "/images/placeholder_image.png"}
                alt={result.name}
                className="search-result-image"
              />
              <span>{result.name}</span>
            </Link>
          ))}
        </div>
        )}
      </form>
  
      {/* Navigation Menu */}
      <ul className="nav-menu">
        {/* Account Dropdown or Login */}
        {isAuthenticated && user ? (
          <NavDropdown
            title={
              <div className="account-dropdown-wrapper" onClick={toggleProfileDropdown}>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Account
              </div>
            }
            id="account-dropdown"
            align="end"
            className="account-dropdown"
            show={profileDropdown}
            ref={dropdownRef}
          >
            {/* Admin Links */}
            {isAdmin && (
              <>
                <NavDropdown.Item
                  as={Link}
                  to="/orders"
                  onClick={closeProfileDropdown}
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faBox} className="me-2" />
                  <strong>Orders</strong>
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/items"
                  onClick={closeProfileDropdown}
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                  <strong>Items</strong>
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/statistics"
                  onClick={closeProfileDropdown}
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  <strong>Statistics</strong>
                </NavDropdown.Item>
                <NavDropdown.Divider />
              </>
            )}
  
            {/* Profile and Logout */}
            <NavDropdown.Item
              as={Link}
              to={`/account`}
              onClick={closeProfileDropdown}
              className="dropdown-item"
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <strong>Profile</strong>
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => {
                closeProfileDropdown();
                handleLogout();
              }}
              className="dropdown-item"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              <strong>Logout</strong>
            </NavDropdown.Item>
          </NavDropdown>
        ) : (
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Login
            </Link>
          </li>
        )}
  
        {/* Cart */}
        <li className="nav-item">
          <Link to="/cart" className="nav-link">
            <FontAwesomeIcon icon={faCartShopping} className="me-2" />
            Cart <span className="cart-count">({cartCount})</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;