from flask import Blueprint, request, jsonify
from models import Coupon

coupons_bp = Blueprint("coupons", __name__)


@coupons_bp.route("/", methods=["GET"])
def get_coupons():
    """Return coupons, optionally filtered by store chain."""
    store_chain = request.args.get("store")

    query = Coupon.query
    if store_chain:
        query = query.filter_by(store_chain=store_chain)

    coupons = query.all()
    return jsonify([c.to_dict() for c in coupons]), 200
