from flask import jsonify, request, Blueprint
from models import db, Books, User
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

books_bp = Blueprint("books_bp", __name__)

@books_bp.route("/books", methods=["POST"])
@jwt_required()
def add_books():
    try:
        data = request.get_json()
        Genre = data['Genre']
        Title = data['Title']
        current_user_id = get_jwt_identity()
        borrowed_at = datetime.strptime(data['borrowed_at'], '%Y-%m-%d')
        returned_at = datetime.strptime(data['returned_at'], '%Y-%m-%d')

        if not current_user_id:
            return jsonify({"error": "User not found"}), 404
        
        new_book = Books(Title=Title, Genre=Genre, borrowed_at=borrowed_at, returned_at=returned_at, user_id=current_user_id)
        db.session.add(new_book)
        db.session.commit()
        return jsonify({"success": "Book added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@books_bp.route("/books", methods=["GET"])
@jwt_required()
def fetch_books():
    current_user_id = get_jwt_identity()
    books = Books.query.filter_by(user_id=current_user_id).all()
    return jsonify([{ 
        "id": book.id,
        "Title": book.Title,
        "Genre": book.Genre,
        "borrowed_at": book.borrowed_at,
        "returned_at": book.returned_at,
        "user": {
            "id": book.user.id,
            "email": book.user.email,
            "role": book.user.role,
            "grade": book.user.grade,
        }
    } for book in books]), 200

@books_bp.route("/books/<int:book_id>", methods=["GET"])
@jwt_required()
def get_book(book_id):
    current_user_id = get_jwt_identity()
    book = Books.query.filter_by(id=book_id, user_id=current_user_id).first()
    if book:
        return jsonify({
            "id": book.id,
            "Title": book.Title,
            "Genre": book.Genre,
            "borrowed_at": book.borrowed_at,
            "returned_at": book.returned_at,
        }), 200
    return jsonify({"error": "Book not found"}), 404

@books_bp.route("/books/<int:book_id>", methods=["PATCH"])
@jwt_required()
def update_book(book_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        book = Books.query.filter_by(id=book_id, user_id=current_user_id).first()
        
        if not book:
            return jsonify({"error": "Book not found or unauthorized"}), 404

        book.Title = data.get('Title', book.Title)
        book.Genre = data.get('Genre', book.Genre)
        
        if 'borrowed_at' in data:
            book.borrowed_at = datetime.strptime(data['borrowed_at'], '%Y-%m-%d')
        if 'returned_at' in data:
            book.returned_at = datetime.strptime(data['returned_at'], '%Y-%m-%d')

        db.session.commit()
        return jsonify({"success": "Book updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@books_bp.route("/books/<int:book_id>", methods=["DELETE"])
@jwt_required()
def delete_book(book_id):
    current_user_id = get_jwt_identity()
    book = Books.query.filter_by(id=book_id, user_id=current_user_id).first()
    
    if not book:
        return jsonify({"error": "Book not found or unauthorized"}), 404
    
    db.session.delete(book)
    db.session.commit()
    return jsonify({"success": "Book deleted successfully"}), 200

@books_bp.route("/books/<int:book_id>/borrow", methods=["PUT"])
@jwt_required()
def borrow_book(book_id):
    current_user_id = get_jwt_identity()
    book = Books.query.filter_by(id=book_id).first()
    
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    if book.borrowed_at:
        return jsonify({"error": "Book is already borrowed"}), 400
    
    book.borrowed_at = datetime.now()
    db.session.commit()
    return jsonify({"success": "Book borrowed successfully"}), 200

@books_bp.route("/books/<int:book_id>/return", methods=["PUT"])
@jwt_required()
def return_book(book_id):
    current_user_id = get_jwt_identity()
    book = Books.query.filter_by(id=book_id, user_id=current_user_id).first()
    
    if not book:
        return jsonify({"error": "Book not found or unauthorized"}), 404
    
    if not book.borrowed_at:
        return jsonify({"error": "Book is not borrowed"}), 400
    
    book.borrowed_at = None
    db.session.commit()
    return jsonify({"success": "Book returned successfully"}), 200

@books_bp.route("/books/borrowed", methods=["GET"])
@jwt_required()
def get_borrowed_books():
    current_user_id = get_jwt_identity()
    books = Books.query.filter(Books.user_id == current_user_id, Books.borrowed_at.isnot(None)).all()
    return jsonify([{ "id": book.id, "Title": book.Title, "Genre": book.Genre, "borrowed_at": book.borrowed_at } for book in books]), 200

@books_bp.route("/books/returned", methods=["GET"])
@jwt_required()
def get_returned_books():
    current_user_id = get_jwt_identity()
    books = Books.query.filter(Books.user_id == current_user_id, Books.borrowed_at.is_(None)).all()
    return jsonify([{ "id": book.id, "Title": book.Title, "Genre": book.Genre, "returned_at": book.returned_at } for book in books]), 200

@books_bp.route("/books/overdue", methods=["GET"])
@jwt_required()
def get_overdue_books():
    current_user_id = get_jwt_identity()
    books = Books.query.filter(Books.user_id == current_user_id, Books.returned_at.isnot(None), Books.returned_at < datetime.now()).all()
    return jsonify([{ "id": book.id, "Title": book.Title, "Genre": book.Genre, "returned_at": book.returned_at } for book in books]), 200

@books_bp.route("/books/fine", methods=["GET"])
@jwt_required()
def calculate_fine():
    current_user_id = get_jwt_identity()
    books = Books.query.filter(Books.user_id == current_user_id, Books.returned_at.isnot(None), Books.returned_at < datetime.now()).all()
    
    total_fine = 0
    for book in books:
        overdue_days = (datetime.now() - book.returned_at).days
        fine_per_day = 0.5
        total_fine += overdue_days * fine_per_day
    
    return jsonify({"total_fine": total_fine}), 200

@books_bp.route("/books/report", methods=["GET"])
@jwt_required()
def generate_report():
    current_user_id = get_jwt_identity()
    books = Books.query.filter_by(user_id=current_user_id).all()
    
    report = []
    for book in books:
        report.append({
            "Title": book.Title,
            "Genre": book.Genre,
            "Borrowed_at": book.borrowed_at,
            "Returned_at": book.returned_at,
            "Overdue": (book.returned_at and (datetime.now() - book.returned_at).days > 0)
        })
    
    return jsonify(report), 200
