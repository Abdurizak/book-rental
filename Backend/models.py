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

    books = db.relationship("Book", backref="user", lazy=True)

class Book(db.Model):
    __tablename__ = "book"

    id = db.Column(db.Integer, primary_key=True)
    Title = db.Column(db.String(128), nullable=False)
    Genre = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)  # Added description
    fun_fact = db.Column(db.Text, nullable=True)  # Added fun fact
    borrowed_at = db.Column(db.DateTime, nullable=True)  # Can be NULL if not borrowed
    returned_at = db.Column(db.DateTime, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

class Rental(db.Model):  # ✅ Added Rental Model
    __tablename__ = "rental"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("book.id"), nullable=False)
    borrowed_at = db.Column(db.DateTime, default=datetime.utcnow)
    returned_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", backref="rentals")
    book = db.relationship("Book", backref="rentals")

class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
