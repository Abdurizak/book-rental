import React, { useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/books?search=${searchQuery}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books');
    }
  };

  const handleRentBook = async (bookId) => {
    try {
      await axios.post('/api/rent-book', { bookId });
      alert('Book rented successfully');
    } catch (error) {
      alert('Error renting book');
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <input
        type="text"
        placeholder="Search for books"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {books.map((book) => (
          <div key={book.id}>
            <p>{book.title} by {book.author}</p>
            <button onClick={() => handleRentBook(book.id)}>Rent</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
