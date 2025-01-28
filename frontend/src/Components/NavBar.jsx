import { Outlet, Link } from "react-router-dom";
import React from 'react';

const Navbar = () => {
  return (
    <>
      <nav className=" p-4 flex justify-between items-center">
        {/* Left Side: Logo */}
        <div className="flex items-center space-x-4">
          <img src="https://images.unsplash.com/photo-1556360853-5c1e1b64ff6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxpYnJhcnklMjBsb2dvfGVufDB8fDB8fHww" alt="Logo" className="h-12" />
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
