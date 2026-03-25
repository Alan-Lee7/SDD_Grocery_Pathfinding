from flask import Blueprint, request, jsonify
from models import GroceryItem, ItemStoreAvailability
from database import db
import json

items_bp = Blueprint("items", __name__)


@items_bp.route("/", methods=["GET"])
def get_items():
    """Return grocery items, optionally filtered by store chain, category, or search query."""
    store_chain = request.args.get("store")
    category = request.args.get("category")
    search = request.args.get("search", "").lower().strip()

    if store_chain:
        available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(
            store_chain=store_chain
        ).scalar_subquery()
        query = GroceryItem.query.filter(GroceryItem.id.in_(available_ids))
    else:
        query = GroceryItem.query

    if category:
        query = query.filter_by(category=category)

    items = query.all()

    if search:
        filtered = []
        for item in items:
            keywords = json.loads(item.keywords) if item.keywords else []
            if (
                search in item.title.lower()
                or any(search in kw.lower() for kw in keywords)
            ):
                filtered.append(item)
        items = filtered

    return jsonify([item.to_dict() for item in items]), 200


@items_bp.route("/<int:item_id>", methods=["GET"])
def get_item(item_id):
    """Return a single grocery item by ID."""
    item = GroceryItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    return jsonify(item.to_dict()), 200
