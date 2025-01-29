import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [message, setMessage] = useState('');

  const handleAddBook = async () => {
    try {
      await axios.post('/api/admin/add-book', { title, author, genre });
      setMessage('Book added successfully');
      setTitle('');
      setAuthor('');
      setGenre('');
    } catch (error) {
      setMessage('Failed to add book');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Add New Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <button onClick={handleAddBook}>Add Book</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
