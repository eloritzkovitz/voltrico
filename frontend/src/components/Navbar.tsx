"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBox,
  FaShoppingBag,
  FaChartBar,
} from "react-icons/fa";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/assets";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import searchService from "@/services/search-service";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLLIElement>(null);

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
        const results = await searchService.searchProducts(query);
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="shadow flex items-center justify-between px-6 py-3 relative">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/icons/logo.png"
            alt="Home"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Search Bar */}
      <form
        role="search"
        aria-label="Site Search"
        className="relative flex-1 mx-6"
        onSubmit={handleSearchSubmit}
      >
        <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-1">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            name="query"
            placeholder="Search..."
            aria-label="Search Input"
            className="flex-1 bg-transparent outline-none px-2 py-1"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
          />
          <button
            type="submit"
            className="ml-2 text-blue-600 hover:text-blue-800"
            aria-label="Search Button"
          >
            <FaSearch />
          </button>
        </div>
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow z-10">
            {searchResults.map((result) => (
              <Link
                key={result._id}
                href={`/products/${result._id}`}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                <Image
                  src={result.imageURL ?? DEFAULT_PRODUCT_IMAGE}
                  alt={result.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-cover rounded"
                />
                <span>{result.name}</span>
              </Link>
            ))}
          </div>
        )}
      </form>

      {/* Navigation Menu */}
      <ul className="flex items-center gap-6">
        {/* Account Dropdown or Login */}
        {isAuthenticated && user ? (
          <li className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              onClick={toggleProfileDropdown}
            >
              <FaUser className="text-blue-600" />
              Account
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow z-20 min-w-[180px]">
                {isAdmin && (
                  <>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-full"
                      onClick={closeProfileDropdown}
                    >
                      <FaBox className="text-gray-600" />
                      <strong>Orders</strong>
                    </Link>
                    <Link
                      href="/products"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-full"
                      onClick={closeProfileDropdown}
                    >
                      <FaShoppingBag className="text-gray-600" />
                      <strong>Items</strong>
                    </Link>
                    <Link
                      href="/statistics"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-full"
                      onClick={closeProfileDropdown}
                    >
                      <FaChartBar className="text-gray-600" />
                      <strong>Statistics</strong>
                    </Link>
                    <hr className="my-1" />
                  </>
                )}
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-full"
                  onClick={closeProfileDropdown}
                >
                  <FaUser className="text-gray-600" />
                  <strong>Profile</strong>
                </Link>
                <button
                  onClick={() => {
                    closeProfileDropdown();
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-200 rounded-full"
                >
                  <FaSignOutAlt className="text-gray-600" />
                  <strong>Logout</strong>
                </button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaUser className="text-blue-600" />
              Login
            </Link>
          </li>
        )}

        {/* Cart */}
        <li>
          <Link
            href="/cart"
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FaShoppingCart className="text-blue-600" />
            Cart{" "}
            <span className="ml-1 bg-blue-600 text-white rounded px-2 py-0.5 text-xs">
              {cartCount}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
