import React, { useEffect, useState } from "react";
import axios from "axios";

const UserRentals = () => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get("/api/user/rentals"); // Create this route in your backend
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals");
      }
    };
    fetchRentals();
  }, []);

  const handleReturnBook = async (rentalId) => {
    try {
      await axios.post(`/api/user/return-book/${rentalId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Book returned successfully");
      setRentals((prevRentals) =>
        prevRentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: "Returned" } : rental
        )
      );
    } catch (error) {
      alert("Error returning book");
    }
  };

  return (
    <div>
      <h2>Your Rentals</h2>
      <ul>
        {rentals.map((rental) => (
          <li key={rental.id}>
            <p>{rental.book.title} (Status: {rental.status})</p>
            {rental.status === "Rented" && (
              <button onClick={() => handleReturnBook(rental.id)}>
                Return Book
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRentals;
