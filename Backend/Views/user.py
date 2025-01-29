from flask import jsonify, request, Blueprint
from models import db, User, Rental, Book
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message

from app import *

user_bp = Blueprint("user_bp", __name__)
@user_bp.route("/users", methods=['GET'])
def get_user():
    users = User.query.all()
    user_list=[]
    for user in users:
        user_list.append({
            "id": user.id,
            "email":user.email,
            "role":user.role,
            "grade":user.grade,
            "books":[{
                "id":books.id,
                "Title":books.Title,
                "Genre":books.Genre,
                "borrowed_at":books.borrowed_at,
                "returned_at":books.returned_at
            } for books in user.books]
            
        })
    return jsonify(user_list)
    
@user_bp.route("/users",methods=["POST"])
def add_users():
    from app import mail
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    role = data.get("role")
    grade = data.get("grade")
    password = data.get("password")

    # Check for existing username or email
    check_username = User.query.filter_by(username=username).first()
    check_email = User.query.filter_by(email=email).first()
    if check_username or check_email:
        return jsonify({"error": "Username or Email already exists"}), 400

    # Add new user to the database
    new_user = User(
        username=username,
        email=email,
        role=role,
        grade=grade,
        password=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()

    # Send Welcome Email
    try:
        msg = Message(
            subject="Welcome to Heaven Of Pages",
            recipients=[email],
            body="Welcome to the Heaven of Pages Library! Your journey into the world of stories, knowledge, and adventures begins here. Happy reading!",
        )
      
        mail.send(msg)
        return jsonify({"success": "User created and email sent successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500

@user_bp.route("/user", methods=["PATCH"])
@jwt_required()
def update_user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user:
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        user.grade = data.get('grade', user.grade)

        db.session.commit()
        return jsonify({"success": "User  profile updated successfully"}), 200
    else:
        return jsonify({"error": "User  not found"}), 404

@user_bp.route("/user/updatepassword", methods=["PATCH"])
@jwt_required()
def update_user_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user:
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({"error": "Current password and new password are required"}), 400

        if check_password_hash(user.password, current_password):
            user.password = generate_password_hash(new_password)
            db.session.commit()
            return jsonify({"success": "User  password updated successfully"}), 200
        else:
            return jsonify({"error": "Invalid current password"}), 401
    else:
        return jsonify({"error": "User  not found"}), 404
    
@user_bp.route("/user/<int:user_id>", methods=["DELETE"])
def delete_users(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success":"Deleted successfully"}), 200

    else:
        return jsonify({"error":"User your are trying to delete doesn't exist!"}),406


@user_bp.route("/user/resetpassword/<token>", methods=["GET", "POST"])
def reset_password(token):
    user = User.verify_reset_token(token)

    if not user:
        return jsonify({"error": "Token is invalid or expired"}), 401

    if request.method == "POST":
        data = request.get_json()
        new_password = data.get("new_password")

        if not new_password:
            return jsonify({"error": "New password is required"}), 400

        user.password = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({"success": "Password reset successfully"}), 200

    return jsonify({"message": "Reset password form"}), 200

@user_bp.route("/user/return-book/<int:rental_id>", methods=["POST"])
@jwt_required()
def return_rented_book(rental_id):
    current_user_id = get_jwt_identity()
    rental = Rental.query.filter_by(id=rental_id, user_id=current_user_id, status="Rented").first()

    if not rental:
        return jsonify({"error": "Rental record not found or book already returned"}), 404

    # Mark as returned and set the return date
    rental.status = "Returned"
    rental.returned_at = datetime.utcnow()

    # Optionally, update the book's availability
    book = Book.query.get(rental.book_id)
    if book:
        book.available = True  # Assuming `available` is a column in the Book model

    db.session.commit()
    
    return jsonify({"success": "Book returned successfully"}), 200