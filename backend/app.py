import os
from flask import Flask
from database import db
from extensions import bcrypt, jwt, cors


def create_app():
    app = Flask(__name__)

    # --- Configuration ---
    base_dir = os.path.abspath(os.path.dirname(__file__))
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"sqlite:///{os.path.join(base_dir, 'shoproute.db')}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    # Change this to a strong random value in production
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "shoproute-dev-secret-key")

    # --- Initialize extensions ---
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # --- Register blueprints ---
    from routes.auth import auth_bp
    from routes.stores import stores_bp
    from routes.items import items_bp
    from routes.coupons import coupons_bp
    from routes.cart import cart_bp
    from routes.optimize import optimize_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(stores_bp, url_prefix="/api/stores")
    app.register_blueprint(items_bp, url_prefix="/api/items")
    app.register_blueprint(coupons_bp, url_prefix="/api/coupons")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(optimize_bp, url_prefix="/api/optimize")

    # --- Create database tables ---
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
