from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import db
from models import User
from extensions import bcrypt

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"error": "email, name, and password are required"}), 400

    email = data["email"].lower().strip()

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    password_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = User(
        email=email,
        name=data["name"].strip(),
        password_hash=password_hash,
        zip_code=data.get("zip_code", ""),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a user and return a JWT token."""
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "email and password are required"}), 400

    email = data["email"].lower().strip()
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "No account found with this email"}), 401

    if not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Incorrect password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Get the current user's profile."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update the current user's preferences."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}

    if "zip_code" in data:
        user.zip_code = data["zip_code"]
    if "prefer_store_brand" in data:
        user.prefer_store_brand = bool(data["prefer_store_brand"])
    if "large_text" in data:
        user.large_text = bool(data["large_text"])
    if "budget" in data:
        user.budget = float(data["budget"])

    db.session.commit()
    return jsonify(user.to_dict()), 200
