from flask import jsonify, request, Blueprint
from models import db, Book, User
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS

books_bp = Blueprint("books_bp", __name__)
CORS(books_bp)

# ===========================
# Add a New Book (Admin Only)
# ===========================
@books_bp.route("/books", methods=["POST"])
@jwt_required()
def add_books():
    try:
        data = request.get_json()
        
        if not all(k in data for k in ["title", "author", "genre", "description", "fun_fact"]):
            return jsonify({"error": "Missing required fields"}), 400

        new_book = Book(
            title=data.get("title"),
            author=data.get("author"),
            genre=data.get("genre"),
            description=data.get("description", ""),
            fun_fact=data.get("fun_fact", "")
        )

        db.session.add(new_book)
        db.session.commit()
        return jsonify({"success": "Book added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ===========================
# Fetch Books (Admin & Users)
# ===========================
@books_bp.route("/books", methods=["GET"])
@jwt_required()
def fetch_books():
    try:
        books = Book.query.all()

        # ✅ Debugging: Print books in the backend
        print("Books in DB:", books)

        return jsonify([
            {
                "id": book.id,
                "title": book.title,  # ✅ Ensure correct field names
                "author": book.author,
                "genre": book.genre,
                "description": book.description,
                "fun_fact": book.fun_fact,
                "borrowed_at": book.borrowed_at,
                "returned_at": book.returned_at,
                "is_rented": book.borrowed_at is not None
            } for book in books
        ]), 200

    except Exception as e:
        print("Error fetching books:", str(e))  # ✅ Debugging
        return jsonify({"error": str(e)}), 500


# ===========================
# Fetch a Single Book
# ===========================
@books_bp.route("/books/<int:book_id>", methods=["GET"])
@jwt_required()
def get_book(book_id):
    book = Book.query.get(book_id)
    if book:
        return jsonify({
            "id": book.id,
            "title": book.title,
            "genre": book.genre,
            "description": book.description,
            "fun_fact": book.fun_fact,
            "borrowed_at": book.borrowed_at,
            "returned_at": book.returned_at,
            "is_rented": book.is_rented
        }), 200
    return jsonify({"error": "Book not found"}), 404

# ===========================
# Update Book Details (Admin)
# ===========================
@books_bp.route("/books/<int:book_id>", methods=["PATCH"])
@jwt_required()
def update_book(book_id):
    try:
        data = request.get_json()
        book = Book.query.get(book_id)

        if not book:
            return jsonify({"error": "Book not found"}), 404

        book.title = data.get('title', book.title)
        book.genre = data.get('genre', book.genre)
        book.description = data.get('description', book.description)
        book.fun_fact = data.get('fun_fact', book.fun_fact)

        db.session.commit()
        return jsonify({"success": "Book updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# ===========================
# Delete a Book (Admin)
# ===========================
@books_bp.route("/books/<int:book_id>", methods=["DELETE"])
@jwt_required()
def delete_book(book_id):
    book = Book.query.get(book_id)

    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"success": "Book deleted successfully"}), 200

# ===========================
# Borrow a Book
# ===========================
@books_bp.route("/books/<int:book_id>/borrow", methods=["PUT"])
@jwt_required()
def borrow_book(book_id):
    book = Book.query.get(book_id)
    
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    if book.is_rented:
        return jsonify({"error": "Book is already rented"}), 400
    
    book.is_rented = True
    book.borrowed_at = datetime.now()
    book.returned_at = datetime.now() + timedelta(days=14)  # Due in 2 weeks
    db.session.commit()
    
    return jsonify({
        "success": "Book borrowed successfully",
        "return_date": book.returned_at.strftime("%Y-%m-%d")
    }), 200

# ===========================
# Return a Book
# ===========================
@books_bp.route("/books/<int:book_id>/return", methods=["PUT"])
@jwt_required()
def return_book(book_id):
    book = Book.query.get(book_id)

    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    if not book.is_rented:
        return jsonify({"error": "Book is not rented"}), 400
    
    book.is_rented = False
    book.borrowed_at = None
    book.returned_at = None
    db.session.commit()
    
    return jsonify({"success": "Book returned successfully"}), 200

# ===========================
# Get Borrowed Books
# ===========================
@books_bp.route("/books/borrowed", methods=["GET"])
@jwt_required()
def get_borrowed_books():
    books = Book.query.filter_by(is_rented=True).all()
    return jsonify([
        {
            "id": book.id,
            "title": book.title,
            "genre": book.genre,
            "borrowed_at": book.borrowed_at
        } for book in books
    ]), 200

# ===========================
# Get Overdue Books
# ===========================
@books_bp.route("/books/overdue", methods=["GET"])
@jwt_required()
def get_overdue_books():
    overdue_books = Book.query.filter(Book.is_rented == True, Book.returned_at < datetime.now()).all()
    return jsonify([
        {
            "id": book.id,
            "title": book.title,
            "genre": book.genre,
            "returned_at": book.returned_at
        } for book in overdue_books
    ]), 200

# ===========================
# Calculate Fine for Overdue Books
# ===========================
@books_bp.route("/books/fine", methods=["GET"])
@jwt_required()
def calculate_fine():
    books = Book.query.filter(Book.is_rented == True, Book.returned_at < datetime.now()).all()
    
    total_fine = sum((datetime.now() - book.returned_at).days * 0.5 for book in books if book.returned_at)

    return jsonify({"total_fine": total_fine}), 200
