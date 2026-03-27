from flask import Blueprint, request, jsonify
from services.optimize_service import optimize_shopping_list

optimize_bp = Blueprint("optimize", __name__)


@optimize_bp.route("/", methods=["POST"])
def optimize():
    data = request.get_json() or {}
    items = data.get("items", [])
    store_chain = data.get("store_chain", "")
    prefer_store_brand = bool(data.get("prefer_store_brand", False))
    budget = float(data.get("budget", 0) or 0)
    coupon_mode = bool(data.get("coupon_mode", False))
    accessibility_mode = bool(data.get("accessibility_mode", False))

    if not items or not store_chain:
        return jsonify({"error": "items and store_chain are required"}), 400

    result = optimize_shopping_list(
        input_items=items,
        store_chain=store_chain,
        prefer_store_brand=prefer_store_brand,
        budget=budget,
        coupon_mode=coupon_mode,
        accessibility_mode=accessibility_mode,
    )
    return jsonify(result), 200
