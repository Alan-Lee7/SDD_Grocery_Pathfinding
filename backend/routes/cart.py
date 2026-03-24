from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import ShoppingCart, CartItem, GroceryItem

cart_bp = Blueprint("cart", __name__)


def _get_or_create_cart(user_id: int, store_id: int | None, store_chain: str | None) -> ShoppingCart:
    """Return the user's active cart for a store, creating one if needed."""
    cart = ShoppingCart.query.filter_by(user_id=user_id, store_chain=store_chain).first()
    if not cart:
        cart = ShoppingCart(user_id=user_id, store_id=store_id, store_chain=store_chain)
        db.session.add(cart)
        db.session.commit()
    return cart


@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():
    """Get the current user's cart for a given store chain."""
    user_id = int(get_jwt_identity())
    store_chain = request.args.get("store")

    query = ShoppingCart.query.filter_by(user_id=user_id)
    if store_chain:
        query = query.filter_by(store_chain=store_chain)

    cart = query.first()
    if not cart:
        return jsonify({"id": None, "items": [], "total_cost": 0.0}), 200

    return jsonify(cart.to_dict()), 200


@cart_bp.route("/", methods=["POST"])
@jwt_required()
def save_cart():
    """Save (replace) the full cart for a store. Expects { store_id, store_chain, items: [{item_id, quantity}] }."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    store_id = data.get("store_id")
    store_chain = data.get("store_chain")
    items_data = data.get("items", [])

    cart = _get_or_create_cart(user_id, store_id, store_chain)

    # Replace all cart items
    CartItem.query.filter_by(cart_id=cart.id).delete()

    for entry in items_data:
        item_id = entry.get("item_id")
        quantity = entry.get("quantity", 1)
        if item_id and quantity > 0:
            db.session.add(CartItem(cart_id=cart.id, item_id=item_id, quantity=quantity))

    db.session.commit()
    return jsonify(cart.to_dict()), 200


@cart_bp.route("/items", methods=["POST"])
@jwt_required()
def add_cart_item():
    """Add or update one item in the cart. Expects { store_id, store_chain, item_id, quantity }."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    store_id = data.get("store_id")
    store_chain = data.get("store_chain")
    item_id = data.get("item_id")
    quantity = data.get("quantity", 1)

    if not item_id:
        return jsonify({"error": "item_id is required"}), 400

    if not GroceryItem.query.get(item_id):
        return jsonify({"error": "Item not found"}), 404

    cart = _get_or_create_cart(user_id, store_id, store_chain)

    existing = CartItem.query.filter_by(cart_id=cart.id, item_id=item_id).first()
    if existing:
        existing.quantity = quantity
    else:
        db.session.add(CartItem(cart_id=cart.id, item_id=item_id, quantity=quantity))

    db.session.commit()
    return jsonify(cart.to_dict()), 200


@cart_bp.route("/items/<int:cart_item_id>", methods=["DELETE"])
@jwt_required()
def remove_cart_item(cart_item_id):
    """Remove a single item from the cart."""
    user_id = int(get_jwt_identity())
    cart_item = CartItem.query.get(cart_item_id)

    if not cart_item or cart_item.cart.user_id != user_id:
        return jsonify({"error": "Cart item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Item removed"}), 200


@cart_bp.route("/", methods=["DELETE"])
@jwt_required()
def clear_cart():
    """Clear all items from the user's cart for a given store chain."""
    user_id = int(get_jwt_identity())
    store_chain = request.args.get("store")

    query = ShoppingCart.query.filter_by(user_id=user_id)
    if store_chain:
        query = query.filter_by(store_chain=store_chain)

    cart = query.first()
    if cart:
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()

    return jsonify({"message": "Cart cleared"}), 200
