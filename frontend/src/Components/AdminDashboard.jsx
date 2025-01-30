import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [funFact, setFunFact] = useState('');
  const [message, setMessage] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/admin/books');
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    try {
      const response = await axios.post('/api/admin/add-book', { 
        title, author, genre, description, funFact 
      });
      setMessage('Book added successfully');
      setBooks([...books, response.data]);
      setTitle('');
      setAuthor('');
      setGenre('');
      setDescription('');
      setFunFact('');
    } catch (error) {
      setMessage('Failed to add book');
    }
  };

  const handleRentBook = (bookId) => {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14); // 2 weeks return period
    alert(`Book rented! Return by: ${returnDate.toDateString()}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Book</h3>
        <input type="text" placeholder="Title" value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"/>
        <input type="text" placeholder="Author" value={author} 
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border rounded mb-2"/>
        <input type="text" placeholder="Genre" value={genre} 
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 border rounded mb-2"/>
        <textarea placeholder="Description" value={description} 
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"/>
        <input type="text" placeholder="Fun Fact" value={funFact} 
          onChange={(e) => setFunFact(e.target.value)}
          className="w-full p-2 border rounded mb-4"/>
        <button onClick={handleAddBook} 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Book
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Available Books</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-bold">{book.title}</h4>
              <p className="text-gray-700"><strong>Author:</strong> {book.author}</p>
              <p className="text-gray-700"><strong>Genre:</strong> {book.genre}</p>
              <p className="text-gray-600"><strong>Description:</strong> {book.description}</p>
              <p className="text-gray-500 italic"><strong>Fun Fact:</strong> {book.funFact}</p>
              <button onClick={() => handleRentBook(book.id)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Rent Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
