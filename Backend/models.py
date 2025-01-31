from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), nullable=False, unique=True)
    email = db.Column(db.String(128), nullable=False, unique=True)
    role = db.Column(db.String(64), nullable=False, default="user")
    grade = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    books = db.relationship("Book", backref="borrower", lazy=True)
    rentals = db.relationship("Rental", backref="renter", lazy=True)  # Fix backref conflict

class Book(db.Model):
    __tablename__ = "book"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)  # ✅ lowercase
    author = db.Column(db.String(128), nullable=False)  
    genre = db.Column(db.String(128), nullable=False)  
    description = db.Column(db.Text, nullable=False)  
    fun_fact = db.Column(db.Text, nullable=True)  
    borrowed_at = db.Column(db.DateTime, nullable=True)
    returned_at = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)




class Rental(db.Model):  # ✅ Fixed Rental Model
    __tablename__ = "rental"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("book.id"), nullable=False)
    borrowed_at = db.Column(db.DateTime, default=datetime.utcnow)
    returned_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", backref="rental_records")
    book = db.relationship("Book", backref="rented_by")  # ✅ Fixed typo in model reference

class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
