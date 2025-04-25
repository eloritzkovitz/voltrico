import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
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

  const handleSearchBlur = () => {
    setTimeout(() => setShowDropdown(false), 200); // Hide dropdown after a short delay
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown((prev) => !prev);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <a href="/">
          <img src="/icons/app/logo.png" alt="Home" />
          AREA
        </a>
      </div>

      {/* Search Bar */}
      <div role="search" aria-label="Site Search" className="search-bar">
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
        <button className="searchButton">
          <FontAwesomeIcon icon={faSearch} />
        </button>
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
        {isAuthenticated && user?.role === "admin" && (
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

        {/* Cart - Visible to all logged-in users */}
        {isAuthenticated && (
          <li>
            <a href="/cart">
              <img src="/icons/cart.png" alt="Cart" />
              Cart
            </a>
          </li>
        )}

        {/* Profile Dropdown */}
        {isAuthenticated ? (
          <li className="nav-item profile-dropdown">
            <div onClick={toggleProfileDropdown} className="profile-dropdown-toggle">
              <img
                src={user?.profilePicture || "/icons/default-profile.png"}
                alt="Profile"
                className="profile-picture"
              />
              <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
            </div>
            {profileDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <img
                    src={user?.profilePicture || "/icons/default-profile.png"}
                    alt="Profile"
                    className="dropdown-profile-picture"
                  />
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="dropdown-user-email">{user?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <a href={`/profile/${user?._id}`} className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
                  Profile
                </a>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                  <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />
                  Logout
                </button>
              </div>
            )}
          </li>
        ) : (
          <li className="nav-item">
            <a href="/login">
              <img src="/icons/login.png" alt="Login" />
              Login
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;