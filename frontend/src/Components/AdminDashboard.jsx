import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "", description: "", fun_fact: "" });


  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://127.0.0.1:5000/books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Books Data:", response.data);

      if (Array.isArray(response.data)) {
        setBooks(response.data);
      } else {
        setBooks([]);
        setError("Invalid data received from API.");
      }
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new book
  const handleAddBook = async () => {
    try {
      const token = sessionStorage.getItem("token");
      
      console.log("Sending book data:", newBook); // ✅ Debugging
  
      const response = await axios.post("http://127.0.0.1:5000/books", newBook, {
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
      });
  
      if (response.status === 201) {
        alert("Book added successfully!");
        setNewBook({ title: "", author: "", genre: "", description: "", fun_fact: "" });
        fetchBooks();
      } else {
        alert(`Failed to add book: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error adding book:", error.response?.data?.error || error.message);
      alert("Error adding book: " + (error.response?.data?.error || error.message));
    }
};

  
  

  // Delete a book
  const handleDeleteBook = async (bookId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:5000/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchBooks();
    } catch (error) {
      console.error("Error deleting book", error);
      setError("Failed to delete the book.");
    }
  };

  if (loading) return <h2 className="text-center text-blue-600">Loading Admin Dashboard...</h2>;
  if (error) return <h2 className="text-center text-red-500">Error: {error}</h2>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Add Book Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Genre" value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} className="p-2 border rounded" />
        </div>
        <textarea placeholder="Description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} className="w-full p-2 border rounded my-2"></textarea>
        <input type="text" placeholder="Fun Fact" value={newBook.fun_fact} onChange={(e) => setNewBook({ ...newBook, fun_fact: e.target.value })} className="w-full p-2 border rounded my-2" />
        <button onClick={handleAddBook} className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-800 transition">Add Book</button>
      </div>

      {/* Book List */}
      <h2 className="text-xl font-semibold mb-4">Books Available</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? books.map((book) => (
          <div key={book.id} className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold">{book.Title}</h3>
            <p><strong>Genre:</strong> {book.Genre}</p>
            <p><strong>Description:</strong> {book.Description}</p>
            <p className="italic"><strong>Fun Fact:</strong> {book.FunFact}</p>
            <p><strong>Status:</strong> {book.is_rented ? `Rented (Return by ${book.returned_at})` : "Available"}</p>
            <button onClick={() => handleDeleteBook(book.id)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition">Delete</button>
          </div>
        )) : (
          <p className="text-gray-600">No books available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
