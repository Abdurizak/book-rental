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

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Books:", response.data);
      setBooks(response.data);
    } catch (error) {
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  // Rent a book
  const handleRentBook = async (bookId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://127.0.0.1:5000/books/${bookId}/borrow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Book rented successfully. Return by: ${response.data.return_date}`);

      // Update rented book list
      setRentedBooks((prev) => ({
        ...prev,
        [bookId]: response.data.return_date,
      }));

      fetchBooks(); // Refresh book list
    } catch (error) {
      console.error("Error renting book:", error.response?.data || error.message);
      alert(`Error renting book: ${error.response?.data?.error || "Try again later."}`);
    }
  };

  // Return a book
  const handleReturnBook = async (bookId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://127.0.0.1:5000/books/${bookId}/return`,
        {}, // ✅ Empty request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Book returned successfully!");
  
      // ✅ Update UI to reflect return
      setRentedBooks((prev) => {
        const updatedRentedBooks = { ...prev };
        delete updatedRentedBooks[bookId];
        return updatedRentedBooks;
      });
  
      fetchBooks(); // Refresh book list
    } catch (error) {
      console.error("Error returning book:", error.response?.data || error.message);
      alert(`Error returning book: ${error.response?.data?.error || "Try again later."}`);
    }
  };
  


  if (loading) return <h2 className="text-center text-blue-600">Loading books...</h2>;
  if (error) return <h2 className="text-center text-red-500">{error}</h2>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">📚 User Dashboard</h2>

      {/* Books Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
              <p className="text-gray-600"><strong>Author:</strong> {book.author}</p>
              <p className="text-gray-600"><strong>Genre:</strong> {book.genre}</p>
              <p className="text-gray-500"><strong>Description:</strong> {book.description}</p>
              <p className="text-gray-500 italic"><strong>Fun Fact:</strong> {book.fun_fact}</p>

              {/* Rent & Return Book Buttons */}
              {book.is_rented ? (
                <button
                  onClick={() => handleReturnBook(book.id)}
                  className="mt-3 w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-all"
                >
                  🔄 Return Book
                </button>
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
