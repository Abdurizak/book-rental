// src/components/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);

  // Fetch all books
  useEffect(() => {
    if (user?.role === "ADMIN") {
      axios.get("/admin/books", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(response => setBooks(response.data))
      .catch(error => console.error("Error fetching books:", error));
    }
  }, [user]);

  // Delete a book
  const handleDeleteBook = (bookId) => {
    axios.delete(`/admin/books/${bookId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => {
      setBooks(books.filter(book => book.id !== bookId));
    })
    .catch(error => console.error("Error deleting book:", error));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{book.Title}</h2>
            <p className="text-gray-600">{book.Genre}</p>
            <p className="text-sm text-gray-500">Borrowed At: {new Date(book.borrowed_at).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Returned At: {book.returned_at ? new Date(book.returned_at).toLocaleDateString() : "Not returned"}</p>
            <button
              onClick={() => handleDeleteBook(book.id)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}