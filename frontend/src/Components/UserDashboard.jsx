import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rentedBooks, setRentedBooks] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books that admin has added
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (error) {
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  // Handle book search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:5000/api/books?search=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks(response.data);
    } catch (error) {
      setError("Error searching books.");
    } finally {
      setLoading(false);
    }
  };

  // Rent a book
  const handleRentBook = async (bookId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://127.0.0.1:5000/api/books/${bookId}/borrow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Book rented successfully. Return by: ${response.data.return_date}`);
      setRentedBooks((prev) => ({
        ...prev,
        [bookId]: response.data.return_date,
      }));
    } catch (error) {
      alert("Error renting book. Try again later.");
    }
  };

  if (loading) return <h2 className="text-center text-blue-600">Loading books...</h2>;
  if (error) return <h2 className="text-center text-red-500">{error}</h2>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">📚 User Dashboard</h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 p-3 border border-gray-300 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700"
        >
          🔍 Search
        </button>
      </div>

      {/* Books Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">{book.Title}</h3>
              <p className="text-gray-600"><strong>Author:</strong> {book.Author}</p>
              <p className="text-gray-600"><strong>Genre:</strong> {book.Genre}</p>
              <p className="text-gray-500"><strong>Description:</strong> {book.Description}</p>
              <p className="text-gray-500 italic"><strong>Fun Fact:</strong> {book.FunFact}</p>

              {/* Rent Book Button */}
              {rentedBooks[book.id] ? (
                <p className="text-green-600 mt-3 font-semibold">
                  ✅ Rented - Return by {rentedBooks[book.id]}
                </p>
              ) : (
                <button
                  onClick={() => handleRentBook(book.id)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
                >
                  📖 Rent This Book
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
