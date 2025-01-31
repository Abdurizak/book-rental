import { Outlet, Link, useNavigate } from "react-router-dom";
import React from "react";
import SearchButton from "./SearchButton"; // Import the SearchButton component

const Navbar = () => {
  const navigate = useNavigate();

  // Logout Function
  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Clear authentication token
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <nav className="p-4 flex justify-between items-center bg-white shadow-md">
        {/* Left Side: Logo */}
        <div className="flex items-center mr-12">
          <img 
            src="https://images.unsplash.com/photo-1615915468538-0fbd857888ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGxpYnJhcnklMjBsb2dvfGVufDB8fDB8fHww" 
            alt="Logo" 
            className="h-16 w-16 rounded-full object-cover mx-4"
          />
        </div>

        {/* Centered Library Name */}
        <h1 className="text-black text-3xl font-bold mx-auto">Heaven of Pages</h1>

        {/* Right Side: Navigation Links */}
        <ul className="flex space-x-6 items-center">
          <li className="nav-item">
            <Link className="nav-link active text-black hover:bg-blue-600 px-4 py-2 rounded transition-colors duration-300" to="/">
              Home
            </Link>
          </li>

          {/* Search Button Component */}
          <li className="nav-item">
            <SearchButton />
          </li>

          {/* Show Logout button only if user is logged in */}
          {sessionStorage.getItem("token") ? (
            <li className="nav-item">
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link active text-black hover:bg-blue-600 px-4 py-2 rounded transition-colors duration-300" to="/Login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-black hover:bg-blue-600 px-4 py-2 rounded transition-colors duration-300" to="/Register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
