


from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from extention import bcrypt  

from models import db, User, Recipe, Review, Favorite 


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SESSION_TYPE'] = 'filesystem'


db.init_app(app)
bcrypt.init_app(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
migrate = Migrate(app, db)
api = Api(app)

class Register(Resource):
    def get(self):
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    def post(self):
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return {"message": "Name, email, and password are required"}, 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"message": "A user with this email already exists"}, 400

        new_user = User(name=name, email=email)
        new_user.set_password(password)  # Hash the password

        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created successfully"}, 201


class Users(Resource):
    def get(self):
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

api.add_resource(Register, "/register")
api.add_resource(Users, "/users")


class Login(Resource):
    def post(self):
        data = request.get_json()  # Extract email and password
        email = data.get("email")
        password = data.get("password")

        # Validate required fields
        if not email or not password:
            return {"message": "Email and password are required"}, 400

        # Check user credentials
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"message": "Invalid email or password"}, 401

        # Create a session
        session["user_id"] = user.id
        session["user_name"] = user.name

        return {"message": f"Welcome, {user.name}!"}, 200


api.add_resource(Login, "/login")


class Logout(Resource):
    def post(self):
        # Check if the user is logged in
        if "user_id" in session:
            session.pop("user_id", None)
            session.pop("user_name", None)
            return {"message": "Logout successful"}, 200
        return {"message": "No user is logged in"}, 400


api.add_resource(Logout, "/logout")


class Recipes(Resource):
    def get(self, id=None):
        if id:
            recipe = Recipe.query.get(id)
            if not recipe:
                return jsonify({"error": "recipe not found"})
            return recipe.to_dict()
        all_recipes = Recipe.query.all()
        recipe_list = [rcpe.to_dict() for rcpe in all_recipes]
        return recipe_list

    def post(self):
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid data"}), 400
        try:
            new_recipe = Recipe(
                title=data.get("title"),
                ingredients=data.get("ingredients"),
                instructions=data.get("instructions"),
                image_url=data.get("image_url")
            )
            db.session.add(new_recipe)
            db.session.commit()
            return jsonify(new_recipe.to_dict()), 201
        except KeyError:
            return jsonify({"error": "Missing required fields"}), 400

    def patch(self, id):
        recipe = Recipe.query.get(id)
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid data"}), 400
        try:
            if "title" in data:
                recipe.title = data["title"]
            if "ingredients" in data:
                recipe.ingredients = data["ingredients"]
            if "instructions" in data:
                recipe.instructions = data["instructions"]
            if "image_url" in data:
                recipe.image_url = data["image_url"]
            db.session.commit()
            return jsonify(recipe.to_dict()), 200
        except KeyError:
            return jsonify({"error": "Invalid fields"}), 400

    def delete(self, id):
        recipe = Recipe.query.get(id)
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404
        try:
            db.session.delete(recipe)
            db.session.commit()
            return jsonify({"message": "Recipe deleted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500


api.add_resource(Recipes, "/recipes", "/recipes/<int:id>")


class Reviews(Resource):
    def get(self, id=None):
        if id:
            review = Review.query.get(id)
            if not review:
                return {"error": "Review not found"}, 404
            return review.to_dict(), 200
        all_reviews = Review.query.all()
        review_list = [rev.to_dict() for rev in all_reviews]
        return review_list, 200

    def post(self):
        # Create a new review
        data = request.get_json()
        if not data:
            return {"error": "Invalid data"}, 400

        # Validate required fields
        required_fields = ["recipe_id", "user_id", "content", "rating"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return {"error": f"'{field}' is required"}, 400

        try:
            new_review = Review(
                recipe_id=data["recipe_id"],
                user_id=data["user_id"],
                content=data["content"],
                rating=data["rating"]
            )
            db.session.add(new_review)
            db.session.commit()
            return new_review.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 500

    def put(self, id):
        # Update an existing review
        review = Review.query.get(id)
        if not review:
            return {"error": "Review not found"}, 404
        data = request.get_json()
        if not data:
            return {"error": "Invalid data"}, 400
        try:
            if "content" in data:
                review.content = data["content"]
            if "rating" in data:
                review.rating = data["rating"]
            db.session.commit()
            return review.to_dict(), 200
        except Exception as e:
            return {"error": str(e)}, 500

    def delete(self, id):
        # Delete a review
        review = Review.query.get(id)
        if not review:
            return {"error": "Review not found"}, 404
        try:
            db.session.delete(review)
            db.session.commit()
            return {"message": "Review deleted successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500


api.add_resource(Reviews, "/reviews", "/reviews/<int:id>")


class Favorites(Resource):
    def get(self, id=None):
        # Fetch a specific favorite by ID
        if id:
            favorite = Favorite.query.get(id)
            if not favorite:
                return {"error": "Favorite not found"}, 404
            return favorite.to_dict(), 200

        # Fetch all favorites if no ID is provided
        all_favorites = Favorite.query.all()
        favorite_list = [fav.to_dict() for fav in all_favorites]
        return favorite_list, 200

    def post(self):
        # Create a new favorite
        data = request.get_json()
        if not data:
            return {"error": "Invalid data"}, 400

        # Validate required fields
        required_fields = ["user_id", "recipe_id"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return {"error": f"'{field}' is required"}, 400

        try:
            new_favorite = Favorite(
                user_id=data["user_id"],
                recipe_id=data["recipe_id"]
            )
            db.session.add(new_favorite)
            db.session.commit()
            return new_favorite.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 500

    def delete(self, id):
        # Delete a favorite
        favorite = Favorite.query.get(id)
        if not favorite:
            return {"error": "Favorite not found"}, 404
        try:
            db.session.delete(favorite)
            db.session.commit()
            return {"message": "Favorite deleted successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500


api.add_resource(Favorites, "/favorites", "/favorites/<int:id>")


if __name__ == '__main__':
    app.run(port=5555, debug=True)
