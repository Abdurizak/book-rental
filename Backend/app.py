from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy 
from models import db, User, Book, Rental, TokenBlocklist  # ✅ Corrected imports
from Views.user import user_bp 
from Views.books import books_bp
from Views.authorization import auth_bp
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_mail import Mail 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://librarydb_gjqx_user:C92iwd7qqr2BvU0qFqd4ZDp8IJzppNoX@dpg-cufn7a2n91rc73ci2ni0-a.oregon-postgres.render.com/librarydb_gjqx'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Email Configuration
app.config["MAIL_SERVER"] = 'smtp.gmail.com'
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = "abdurizak.abubakar@student.moringaschool.com"
app.config["MAIL_PASSWORD"] = "chpv dove bxsz hoqk"
app.config["MAIL_DEFAULT_SENDER"] = "abdurizak.abubakar@student.moringaschool.com"

mail = Mail(app)  # ✅ Removed duplicate initialization

# Registering Blueprints
app.register_blueprint(user_bp)
app.register_blueprint(books_bp)
app.register_blueprint(auth_bp)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    """Check if a token is in the blocklist (revoked)."""
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

if __name__ == "__main__":
    app.run(debug=True)  # ✅ Added debug mode for better error tracking
