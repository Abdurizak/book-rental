import { Outlet, Link } from "react-router-dom";
import React from "react";
import SearchButton from "./SearchButton"; // Import the SearchButton component

const Navbar = () => {
  return (
    <>
      <nav className="p-4 flex justify-between items-center">
        {/* Left Side: Logo with increased spacing */}
        <div className="flex items-center mr-12"> {/* Added right margin for spacing */}
          <img 
            src="https://images.unsplash.com/photo-1615915468538-0fbd857888ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGxpYnJhcnklMjBsb2dvfGVufDB8fDB8fHww" 
            alt="Logo" 
            className="h-20 w-20 rounded-full object-cover mx-4" // Increased size and added margins
          />
        </div>

        {/* Centered Library Name */}
        <h1 className="text-black text-3xl font-bold mx-auto">Heaven of Pages</h1>

        {/* Right Side: Navigation Links */}
        <ul className="flex space-x-6">
          <li className="nav-item">
            <Link className="nav-link active text-black hover:bg-blue-600 px-4 py-2 rounded transition-colors duration-300" aria-current="page" to="/">
              Home
            </Link>
          </li>
          
          {/* Add the SearchButton Component */}
          <li className="nav-item">
            <SearchButton /> {/* This will render the functional search button */}
          </li>
          
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
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
