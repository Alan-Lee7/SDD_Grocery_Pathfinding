from flask import Blueprint, request, jsonify
from models import Store

stores_bp = Blueprint("stores", __name__)


@stores_bp.route("/", methods=["GET"])
def get_stores():
    """Return stores, optionally filtered by zip code or chain."""
    zip_code = request.args.get("zip")
    chain = request.args.get("chain")

    query = Store.query

    if zip_code:
        query = query.filter_by(zip=zip_code)

    if chain:
        query = query.filter_by(chain=chain)

    stores = query.order_by(Store.distance).all()
    return jsonify([s.to_dict() for s in stores]), 200


@stores_bp.route("/<int:store_id>", methods=["GET"])
def get_store(store_id):
    """Return a single store by ID."""
    store = Store.query.get(store_id)
    if not store:
        return jsonify({"error": "Store not found"}), 404
    return jsonify(store.to_dict()), 200
