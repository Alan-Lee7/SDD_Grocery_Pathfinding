from flask import Blueprint, request, jsonify
from models import GroceryItem, ItemStoreAvailability
from database import db

items_bp = Blueprint("items", __name__)


@items_bp.route("/", methods=["GET"])
def get_items():
    """Return grocery items, optionally filtered by store chain, category, or search query.
    Supports pagination via limit (default 100, max 500) and offset params.
    """
    store_chain = request.args.get("store")
    category = request.args.get("category")
    search = request.args.get("search", "").strip()
    limit = min(int(request.args.get("limit", 100)), 500)
    offset = max(int(request.args.get("offset", 0)), 0)

    if store_chain:
        available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(
            store_chain=store_chain
        ).scalar_subquery()
        query = GroceryItem.query.filter(GroceryItem.id.in_(available_ids))
    else:
        query = GroceryItem.query

    if category:
        query = query.filter_by(category=category)

    if search:
        query = query.filter(GroceryItem.title.ilike(f"%{search}%"))

    total = query.count()
    items = query.order_by(GroceryItem.title).offset(offset).limit(limit).all()

    return jsonify({
        "items": [item.to_dict() for item in items],
        "total": total,
        "offset": offset,
        "limit": limit,
    }), 200


@items_bp.route("/categories", methods=["GET"])
def get_categories():
    """Return all distinct categories for a given store chain."""
    store_chain = request.args.get("store")
    if store_chain:
        available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(
            store_chain=store_chain
        ).scalar_subquery()
        query = db.session.query(GroceryItem.category).filter(
            GroceryItem.id.in_(available_ids)
        ).distinct()
    else:
        query = db.session.query(GroceryItem.category).distinct()

    cats = sorted([row[0] for row in query.all() if row[0]])
    return jsonify(cats), 200


@items_bp.route("/<int:item_id>", methods=["GET"])
def get_item(item_id):
    """Return a single grocery item by ID."""
    item = GroceryItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    return jsonify(item.to_dict()), 200
