import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { NavDropdown } from "react-bootstrap";

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirect to login page after logout
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Simulate fetching search results
    if (query.trim()) {
      setSearchResults([
        { id: 1, name: "Sample Result 1" },
        { id: 2, name: "Sample Result 2" },
      ]);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Handle search input blur event
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
      <div role="search" aria-label="Site Search" className="search-bar">
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
              <a
                key={result.id}
                href={`/search/${result.id}`}
                className="search-result-item"
                onClick={() => setShowDropdown(false)}
              >
                {result.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <ul className="nav-menu">
        {/* Admin Links */}
        {isAuthenticated && isAdmin && (
          <>
            <li className="nav-item">
              <a href="/orders">
                <img src="/icons/orders.png" alt="Orders" />
                Orders
              </a>
            </li>
            <li className="nav-item">
              <a href="/items">
                <img src="/icons/items.png" alt="Items" />
                Items
              </a>
            </li>
            <li className="nav-item">
              <a href="/statistics">
                <img src="/icons/group.png" alt="Statistics" />
                Statistics
              </a>
            </li>
          </>
        )}

        {/* Cart */}
        <li>
          <a href="/cart">
            <img src="/icons/cart.png" alt="Cart" />
            Cart
          </a>
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