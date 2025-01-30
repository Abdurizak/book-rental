import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function Login() {
  const { login } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role is USER
  const [errorMessage, setErrorMessage] = useState('');

  // ====> To Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, role); // Pass the selected role to the login function
    } catch (error) {
      setErrorMessage('Invalid login credentials');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="w-[40%] bg-white p-4 rounded-xl h-min">
        <h3 className="text-2xl my-4 font-bold font-mono">Login</h3>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <div className="relative mb-6">
          <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="relative mb-6">
          <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
            placeholder="Password"
            required
          />
        </div>

        <div className="relative mb-6">
          <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-800 transition-all duration-700 rounded-full shadow-xs text-white text-base font-semibold leading-6 mb-6"
        >
          Sign in
        </button>

        <div>
          Not yet registered? <Link to="/Register" className="text-blue-500">Register</Link>
        </div>
      </form>
    </div>
  );
}
