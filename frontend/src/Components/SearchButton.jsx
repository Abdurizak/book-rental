import React, { useState } from 'react';

const SearchButton = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchQuery) {
      alert(`Searching for: ${searchQuery}`);
      // Replace this with your actual search functionality
    } else {
      alert('Please enter a search term.');
    }
  };

  return (
    <div className="relative">
      <input
        id="input-mask"
        className="input px-4 py-2 rounded"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button
        onClick={handleSearchClick}
        className="absolute right-0 top-0 p-2 bg-blue-600 text-white rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchButton;
