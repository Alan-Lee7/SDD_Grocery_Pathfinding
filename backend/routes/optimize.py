import json
from flask import Blueprint, request, jsonify
from models import GroceryItem, ItemPrice, ItemStoreAvailability, StoreLayout
from database import db

optimize_bp = Blueprint("optimize", __name__)


def match_products(input_items: list[str], store_chain: str, prefer_store_brand: bool = False) -> dict:
    """
    Match a list of free-text item names to GroceryItems in the database,
    then group them by aisle using the store's layout.
    """
    # Fetch all items available at this store
    available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(
        store_chain=store_chain
    ).all()
    available_ids = {row[0] for row in available_ids}
    items_at_store = GroceryItem.query.filter(GroceryItem.id.in_(available_ids)).all()

    # Fetch store layout; fall back to Walmart if chain not found
    layouts = StoreLayout.query.filter_by(chain=store_chain).all()
    if not layouts:
        layouts = StoreLayout.query.filter_by(chain="Walmart").all()

    matched = []
    unmatched = []

    for raw_input in input_items:
        lowercase_input = raw_input.lower()

        # Find items whose keywords match the input text
        matching = []
        for item in items_at_store:
            keywords = json.loads(item.keywords) if item.keywords else []
            if any(kw.lower() in lowercase_input or lowercase_input in kw.lower() for kw in keywords):
                matching.append(item)

        selected = None
        if matching:
            if prefer_store_brand:
                store_brand = next((i for i in matching if i.brand == "store"), None)
                if store_brand:
                    selected = store_brand
                else:
                    def get_price(item):
                        price = ItemPrice.query.filter_by(
                            item_id=item.id, store_chain=store_chain
                        ).first()
                        return price.price if price else float("inf")
                    selected = min(matching, key=get_price)
            else:
                selected = matching[0]

        if selected:
            all_prices = {p.store_chain: p.price for p in selected.prices}
            matched.append({
                "raw_input": raw_input,
                "product": {
                    "product_id": selected.id,
                    "title": selected.title,
                    "brand": selected.brand,
                    "prices": all_prices,
                    "image_url": selected.image_url,
                    "affiliate_link": selected.affiliate_link,
                    "availability": selected.availability,
                    "category": selected.category,
                    "keywords": json.loads(selected.keywords) if selected.keywords else [],
                },
            })
        else:
            unmatched.append(raw_input)

    # Group matched items by aisle
    aisle_groups: dict[str, list] = {}
    for item in matched:
        category = item["product"]["category"]
        aisle = next((l for l in layouts if l.category == category), None)
        if not aisle:
            continue
        key = f"{aisle.zone_order}-{aisle.aisle}"
        aisle_groups.setdefault(key, []).append(item)

    # Sort groups by zone_order and build final list
    optimized_list = []
    for key in sorted(aisle_groups.keys(), key=lambda k: int(k.split("-")[0])):
        parts = key.split("-")
        aisle_code = "-".join(parts[1:])
        aisle = next((l for l in layouts if l.aisle == aisle_code), None)
        if not aisle:
            continue
        optimized_list.append({
            "zone_order": aisle.zone_order,
            "aisle": aisle.aisle,
            "aisle_name": aisle.aisle_name,
            "items": aisle_groups[key],
        })

    return {"optimized_list": optimized_list, "unmatched_items": unmatched}


@optimize_bp.route("/", methods=["POST"])
def optimize():
    """
    Optimize a shopping list for a given store.
    Expects { items: [str], store_chain: str, prefer_store_brand: bool }
    """
    data = request.get_json() or {}
    items = data.get("items", [])
    store_chain = data.get("store_chain", "")
    prefer_store_brand = bool(data.get("prefer_store_brand", False))

    if not items or not store_chain:
        return jsonify({"error": "items and store_chain are required"}), 400

    result = match_products(items, store_chain, prefer_store_brand)
    return jsonify(result), 200
