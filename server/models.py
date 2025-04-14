

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from extention import bcrypt


db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    recipes = db.relationship('Recipe', backref='creator', lazy=True)
    reviews = db.relationship('Review', backref='reviewer', lazy=True)
    favorites = db.relationship('Favorite', backref='user', lazy=True)

    serialize_rules = ('-recipes.creator', '-reviews.reviewer', '-favorites.user')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Recipe(db.Model, SerializerMixin):
   

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))

    created_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reviews = db.relationship('Review', backref='recipe', lazy=True)
    favorites = db.relationship('Favorite', backref='recipe', lazy=True)

    serialize_rules = (
        '-reviews.recipe',
        '-favorites.recipe', 
        '-creator.recipes',
        '-creator.reviews',
        '-creator.favorites',
        '-reviews.reviewer',
        '-favorites.user'
    )



class Review(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    serialize_rules = ('-recipe.reviews', '-user.reviews', '-recipe.favorites', '-user.favorites')

class Favorite(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    
    serialize_rules = ('-user.favorites', '-recipe.favorites', '-user.reviews', '-recipe.reviews')