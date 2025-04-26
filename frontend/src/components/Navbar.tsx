import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import itemService from "../services/item-service";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle logout and redirect to login page
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Handle search input change and fetch results
  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
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

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <Link to="/">
          <img src="/icons/app/logo.png" alt="Home" />
          Voltrico
        </Link>
      </div>

      {/* Search Bar */}
      <form
        role="search"
        aria-label="Site Search"
        className="search-bar"
        onSubmit={handleSearchSubmit}
      >
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
        {showDropdown && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((result) => (
              <Link
                key={result._id}
                to={`/items/${result._id}`}
                className="search-result-item"
                onClick={() => setShowDropdown(false)}
              >
                {result.name}
              </Link>
            ))}
          </div>
        )}
      </form>

      {/* Navigation Menu */}
      <ul className="nav-menu">
        {/* Admin Links */}
        {isAuthenticated && isAdmin && (
          <>
            <li className="nav-item">
              <Link to="/orders">
                <img src="/icons/orders.png" alt="Orders" />
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/items">
                <img src="/icons/items.png" alt="Items" />
                Items
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/statistics">
                <img src="/icons/group.png" alt="Statistics" />
                Statistics
              </Link>
            </li>
          </>
        )}

        {/* Cart */}
        <li>
          <Link to="/cart">
            <img src="/icons/cart.png" alt="Cart" />
            Cart
          </Link>
        </li>

        {/* Profile Dropdown */}
        {isAuthenticated && user && (
          <NavDropdown
            title={
              <div
                className="profile-dropdown-wrapper"
                onClick={toggleProfileDropdown}
              >
                <img
                  className="profile-picture-3 rounded-circle"
                  src={user.profilePicture || "/images/default-profile.png"}
                  alt="Profile"
                />
                <FontAwesomeIcon icon={faChevronDown} className="custom-caret" />
              </div>
            }
            id="profile-dropdown"
            align="end"
            className="profile-dropdown"
            show={profileDropdown}
          >
            <NavDropdown.Item as={Link} to={`/profile/${user._id}`} onClick={closeProfileDropdown}>
              <div className="dropdown-item-content">
                <img
                  className="profile-picture-3 rounded-circle mr-10"
                  src={user.profilePicture || "/images/default-profile.png"}
                  alt="Profile"
                />
                <span className="fw-semibold">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to={`/profile/${user._id}`} onClick={closeProfileDropdown}>
              <FontAwesomeIcon className="mr-10" icon={faUser} />
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => { closeProfileDropdown(); handleLogout(); }}>
              <FontAwesomeIcon className="mr-10" icon={faSignOutAlt} />
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;