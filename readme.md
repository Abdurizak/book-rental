## 📚 Heaven of Pages - Book Rental System

## 📝 Project Description

Heaven of Pages is an online book rental platform that allows users to browse, rent, and return books seamlessly. Admins can manage books, track rentals, and oversee the entire process efficiently.

## 🚀 Features

# User Features

✅ User Registration - Users can register an account to rent books.✅ Login & Authentication - Users can log in to manage their rentals.✅ Search Books - Users can search for available books in the library.✅ Rent a Book - Users can borrow a book and get notified about the return date.✅ Return a Book - Users can return a rented book before or on the due date.✅ Logout - Users can log out after completing their transactions.

# Admin Features

✅ Add Books - Admins can add books to the platform for users to rent.✅ Manage Rentals - Admins can track book rentals and their return status.✅ Update Books - Admins can modify book details.✅ Delete Books - Admins can remove books from the platform.

# Upcoming Features

❌ Notifications for Due Date - Users will receive notifications before the book return date.

## 🛠 Tech Stack

Frontend: React.js, Tailwind CSS

Backend: Flask (Python)

Database: SQLAlchemy (SQLite)

Authentication: JWT (JSON Web Tokens)

API Communication: Axios

## 📂 Project Structure

📂 Heaven-of-Pages
├── 📁 Backend (Flask)
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── requirements.txt
│   ├── migrations/
│
├── 📁 Frontend (React.js)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
│
├── README.md

## 🔧 Setup Instructions

1️⃣ Clone the Repository

git clone https://github.com/Abdurizak/book-rental
cd book-rental

2️⃣ Backend Setup (Flask API)

cd Backend
python -m venv venv
source venv/bin/activate  # On Windows use 'venv\Scripts\activate'
pip install -r requirements.txt
flask db upgrade  # Apply database migrations
flask run  # Start backend server

3️⃣ Frontend Setup (React.js)

cd ../Frontend
npm install
npm run dev

4️⃣ Open in Browser

Frontend: http://localhost:5173
Backend: http://127.0.0.1:5000

## 🔑 API Endpoints

Authentication

POST /register - Register a new user

POST /login - Authenticate user and receive a token

POST /logout - Logout and revoke token

Books

GET /books - Fetch all books

POST /books - Add a new book (Admin Only)

PATCH /books/:id - Update book details (Admin Only)

DELETE /books/:id - Delete a book (Admin Only)

PUT /books/:id/borrow - Rent a book

PUT /books/:id/return - Return a rented book

## 🛑 Known Issues

❌ Renting & Returning Books: Some users face errors while renting and returning books. Fixing backend database models is required.❌ Notifications: Currently, there is no feature to notify users about due dates.

## 🤝 Contributing

Fork the repository

Create a new branch: (git checkout -b feature-branch)

Commit your changes: (git commit -m 'Added a new feature')

Push to the branch: (git push origin feature-branch)

Open a Pull Request

## 📜 License

This project is licensed under the MIT License. Feel free to use and modify it.

## 🙌 Acknowledgements

Thanks to everyone who contributed to the development of this project! 😊

