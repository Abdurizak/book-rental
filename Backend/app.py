from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy 
from models import db
from Views import *
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_mail import Mail 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'

db.init_app(app)
migrate = Migrate(app, db)
mail = Mail(app)

app.config["MAIL_SERVER"]= 'smtp.gmail.com'
app.config["MAIL_PORT"]=587
app.config["MAIL_USE_TLS"]=True
app.config["MAIL_USE_SSL"]=False
app.config["MAIL_USERNAME"]="abdurizak.abubakar@student.moringaschool.com"
app.config['MAIL_PASSWORD'] = 'chpv dove bxsz hoqk'  
app.config['MAIL_DEFAULT_SENDER'] = 'abdurizak.abubakar@student.moringaschool.com'


mail = Mail(app)

#registering blueprint 14523
app.register_blueprint(user_bp)
app.register_blueprint(books_bp)
app.register_blueprint(auth_bp)


# jwt
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  timedelta(hours=1)
jwt = JWTManager(app)
jwt.init_app(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None