import math
from flask import Blueprint, request, jsonify
from models import Store

stores_bp = Blueprint("stores", __name__)

SEARCH_RADIUS_MILES = 15


def haversine(lat1, lon1, lat2, lon2):
    """Return distance in miles between two lat/lon points."""
    R = 3958.8  # Earth radius in miles
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def zip_to_latlon(zip_code):
    """Return (lat, lon) for a US ZIP code, or None if not found."""
    try:
        import pgeocode
        nomi = pgeocode.Nominatim("us")
        row = nomi.query_postal_code(zip_code)
        if row is not None and not math.isnan(row.latitude):
            return float(row.latitude), float(row.longitude)
    except Exception:
        pass
    return None


@stores_bp.route("/", methods=["GET"])
def get_stores():
    """Return stores, optionally filtered by proximity to a zip code or by chain."""
    zip_code = request.args.get("zip")
    chain = request.args.get("chain")

    query = Store.query
    if chain:
        query = query.filter_by(chain=chain)

    stores = query.all()

    if zip_code:
        coords = zip_to_latlon(zip_code)
        if coords:
            user_lat, user_lon = coords
            nearby = []
            for s in stores:
                if s.latitude is None or s.longitude is None:
                    continue
                dist = haversine(user_lat, user_lon, s.latitude, s.longitude)
                if dist <= SEARCH_RADIUS_MILES:
                    # Attach computed distance so ordering is relative to the user's zip
                    s.distance = round(dist, 1)
                    nearby.append(s)
            stores = nearby
        else:
            # Fallback: exact zip match if geocoding fails
            stores = [s for s in stores if s.zip == zip_code]

    stores.sort(key=lambda s: s.distance)
    return jsonify([s.to_dict() for s in stores]), 200


@stores_bp.route("/<int:store_id>", methods=["GET"])
def get_store(store_id):
    """Return a single store by ID."""
    store = Store.query.get(store_id)
    if not store:
        return jsonify({"error": "Store not found"}), 404
    return jsonify(store.to_dict()), 200
