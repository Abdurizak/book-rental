from flask import jsonify, request, Blueprint
from models import db, Book, User
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity

books_bp = Blueprint("books_bp", __name__)

# ===========================
# Add a New Book (Admin Only)
# ===========================
@books_bp.route("/books", methods=["POST"])
@jwt_required()
def add_books():
    try:
        data = request.get_json()
        Title = data['Title']
        Genre = data['Genre']
        Description = data.get('Description', '')  # Optional
        FunFact = data.get('FunFact', '')  # Optional

        new_book = Book(
            Title=Title,
            Genre=Genre,
            Description=Description,
            FunFact=FunFact,
            borrowed_at=None,
            returned_at=None,
            is_rented=False
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
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role == "admin":
        books = Book.query.all()  # Admin sees all books
    else:
        books = Book.query.filter_by(user_id=current_user_id).all()  # Users only see their books

    return jsonify([
        {
            "id": book.id,
            "Title": book.Title,
            "Genre": book.Genre,
            "Description": book.Description,
            "FunFact": book.FunFact,
            "borrowed_at": book.borrowed_at,
            "returned_at": book.returned_at,
            "is_rented": book.is_rented
        } for book in books
    ]), 200

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
            "Title": book.Title,
            "Genre": book.Genre,
            "Description": book.Description,
            "FunFact": book.FunFact,
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

        book.Title = data.get('Title', book.Title)
        book.Genre = data.get('Genre', book.Genre)
        book.Description = data.get('Description', book.Description)
        book.FunFact = data.get('FunFact', book.FunFact)

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
            "Title": book.Title,
            "Genre": book.Genre,
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
            "Title": book.Title,
            "Genre": book.Genre,
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

# ===========================
# Generate Report of All Books
# ===========================
@books_bp.route("/books/report", methods=["GET"])
@jwt_required()
def generate_report():
    books = Book.query.all()
    
    report = [
        {
            "Title": book.Title,
            "Genre": book.Genre,
            "Description": book.Description,
            "FunFact": book.FunFact,
            "Borrowed_at": book.borrowed_at,
            "Returned_at": book.returned_at,
            "Overdue": book.returned_at and (datetime.now() - book.returned_at).days > 0
        }
        for book in books
    ]
    
    return jsonify(report), 200
