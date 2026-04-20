import json
import re
from typing import List, Optional, Dict
from models import GroceryItem, ItemPrice, ItemStoreAvailability, Coupon, CouponProduct
from database import db


def items_available_at_store(store_chain: str) -> List[GroceryItem]:
    available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(store_chain=store_chain).all()
    available_ids = {row[0] for row in available_ids}
    if not available_ids:
        return []
    return GroceryItem.query.filter(GroceryItem.id.in_(available_ids)).all()


def match_candidates(raw_input: str, items_at_store: List[GroceryItem]) -> List[GroceryItem]:
    lowercase_input = (raw_input or "").strip().lower()

    exact = [item for item in items_at_store if (item.title or "").strip().lower() == lowercase_input]
    if exact:
        return exact

    title_hits = [item for item in items_at_store if lowercase_input and lowercase_input in (item.title or "").lower()]
    if title_hits:
        return title_hits

    matching = []
    for item in items_at_store:
        keywords = json.loads(item.keywords) if item.keywords else []
        if any(kw.lower() in lowercase_input or lowercase_input in kw.lower() for kw in keywords):
            matching.append(item)
    return matching


def get_store_price(item: GroceryItem, store_chain: str) -> float:
    price = ItemPrice.query.filter_by(item_id=item.id, store_chain=store_chain).first()
    return price.price if price else float("inf")


def _parse_dollar_discount(discount: str) -> Optional[float]:
    m = re.search(r"\$\s*([0-9]+(?:\.[0-9]+)?)", discount or "")
    if not m:
        return None
    return float(m.group(1))


def _parse_x_for_y(discount: str):
    m = re.search(r"(\d+)\s*for\s*\$\s*([0-9]+(?:\.[0-9]+)?)", discount or "", flags=re.IGNORECASE)
    if not m:
        return None
    x = int(m.group(1))
    y = float(m.group(2))
    if x <= 0:
        return None
    return x, y


def _effective_unit_price(base_price: float, coupon_type: str, discount: str) -> Optional[float]:
    ctype = (coupon_type or "").lower()
    disc = (discount or "").strip()

    if ctype == "dollar":
        amt = _parse_dollar_discount(disc)
        if amt is None:
            return None
        return max(0.0, base_price - amt)

    if ctype == "bogo":
        if "b2g1" in disc.lower():
            return (2.0 * base_price) / 3.0
        return base_price / 2.0

    if ctype == "special":
        parsed = _parse_x_for_y(disc)
        if parsed is None:
            amt = _parse_dollar_discount(disc)
            if amt is None:
                return None
            return max(0.0, base_price - amt)
        x, y = parsed
        return y / x

    return None


# Hardcoded fallback rules matching seed_coupons.py intent.
# Used when DB coupon-product links are missing/incomplete.
HARD_COUPON_RULES = {
    "Hannaford": [
        {"contains": "artisan bread", "category": "Bakery", "coupon_type": "dollar", "discount": "$2", "title": "$2 Off Hannaford Artisan Bread"},
        {"contains": "orange juice", "category": "Beverages", "coupon_type": "bogo", "discount": "BOGO", "title": "BOGO Hannaford Orange Juice"},
        {"contains": "chobani", "category": "Dairy", "coupon_type": "bogo", "discount": "B2G1", "title": "Greek Yogurt Buy 2 Get 1 Free"},
        {"contains": "nature valley", "category": "Pantry", "coupon_type": "dollar", "discount": "$1.50", "title": "$1.50 Off Nature Valley Bars"},
        {"contains": "pork chop", "category": "Meat", "coupon_type": "special", "discount": "2 for $10", "title": "Pork Chops 2 for $10"},
        {"contains": "avocado", "category": "Produce", "coupon_type": "dollar", "discount": "$1", "title": "$1 Off Avocados"},
        {"contains": "pasta", "category": "Pantry", "coupon_type": "special", "discount": "3 for $4", "title": "Pasta 3 for $4"},
    ],
    "Walmart": [
        {"contains": "milk", "category": "Dairy", "coupon_type": "dollar", "discount": "$1", "title": "$1 Off Half Gallon of Milk"},
        {"contains": "sandwich bread", "category": "Bakery", "coupon_type": "special", "discount": "2 for $5", "title": "Bread 2 for $5"},
        {"contains": "pasta sauce", "category": "Pantry", "coupon_type": "bogo", "discount": "BOGO", "title": "BOGO Pasta Sauce"},
        {"contains": "chicken breast", "category": "Meat", "coupon_type": "special", "discount": "$2/lb", "title": "$2 Off Boneless Chicken Breast"},
        {"contains": "eggs", "category": "Dairy", "coupon_type": "special", "discount": "2 for $5", "title": "Eggs 2 for $5"},
        {"contains": "cheerios", "category": "Pantry", "coupon_type": "dollar", "discount": "$1.50", "title": "$1.50 Off Cheerios"},
        {"contains": "pizza", "category": "Frozen", "coupon_type": "special", "discount": "3 for $10", "title": "Frozen Pizza 3 for $10"},
        {"contains": "bananas", "category": "Produce", "coupon_type": "bogo", "discount": "BOGO", "title": "BOGO Bananas"},
    ],
    "Aldi": [
        {"contains": "ground beef", "category": "Meat", "coupon_type": "special", "discount": "2 for $11", "title": "Ground Beef 2 for $11"},
        {"contains": "strawberr", "partial": True, "category": "Produce", "coupon_type": "dollar", "discount": "$1", "title": "$1 Off Strawberries"},
        {"contains": "cheese", "category": "Dairy", "coupon_type": "bogo", "discount": "BOGO", "title": "BOGO Cheese"},
        {"contains": "salmon", "category": "Seafood", "coupon_type": "dollar", "discount": "$2", "title": "Salmon Fillet $2 Off"},
        {"contains": "chobani", "category": "Dairy", "coupon_type": "special", "discount": "3 for $5", "title": "Greek Yogurt 3 for $5"},
        {"contains": "eggs", "category": "Dairy", "coupon_type": "dollar", "discount": "$1.50", "title": "$1.50 Off Dozen Eggs"},
        {"contains": "bean", "partial": True, "category": "Pantry", "coupon_type": "special", "discount": "3 for $5", "title": "Canned Beans 3 for $5"},
        {"contains": "rotisserie chicken", "category": "Meat", "coupon_type": "dollar", "discount": "$2", "title": "$2 Off Rotisserie Chicken"},
    ],
    "Price Chopper": [
        {"contains": "milk", "category": "Dairy", "coupon_type": "dollar", "discount": "$1", "title": "$1 Off Milk Gallon"},
        {"contains": "chicken breast", "category": "Meat", "coupon_type": "special", "discount": "2 for $16", "title": "Chicken Breast 2 for $16"},
        {"contains": "pasta sauce", "category": "Pantry", "coupon_type": "bogo", "discount": "BOGO", "title": "BOGO Pasta Sauce"},
        {"contains": "eggs", "category": "Dairy", "coupon_type": "dollar", "discount": "$1.50", "title": "$1.50 Off Dozen Eggs"},
        {"contains": "greek yogurt", "category": "Dairy", "coupon_type": "special", "discount": "4 for $5", "title": "Yogurt 4 for $5"},
        {"contains": "strawberr", "partial": True, "category": "Produce", "coupon_type": "dollar", "discount": "$1", "title": "$1 Off Fresh Strawberries"},
        {"contains": "frozen", "category": "Frozen", "coupon_type": "special", "discount": "3 for $15", "title": "Frozen Vegetables 3 for $15"},
        {"contains": "sandwich bread", "category": "Bakery", "coupon_type": "dollar", "discount": "$1.50", "title": "$1.50 Off Sandwich Bread"},
    ],
}


def hardcoded_coupon_for_title(title: str, store_chain: str, base_price: float, category: str = None) -> Optional[Dict]:
    t = (title or "").lower()
    rules = HARD_COUPON_RULES.get(store_chain, [])

    best = None
    best_price = base_price
    for r in rules:
        # Skip rule if it specifies a category and the product category doesn't match
        if r.get("category") and category and r["category"].lower() != (category or "").lower():
            continue
        if r.get("partial"):
            matched = r["contains"] in t
        else:
            matched = bool(re.search(r'\b' + re.escape(r["contains"]) + r'\b', t))
        if matched:
            eff = _effective_unit_price(base_price, r["coupon_type"], r["discount"])
            if eff is None:
                continue
            if eff < best_price:
                best_price = eff
                best = r

    if not best:
        return None

    return {
        "coupon_code": None,
        "title": best["title"],
        "discount": best["discount"],
        "coupon_type": best["coupon_type"],
        "effective_unit_price": round(best_price, 2),
        "source": "hardcoded_fallback",
    }


def best_coupon_for_item(item: GroceryItem, store_chain: str, base_price: float) -> Optional[Dict]:
    coupons = (
        Coupon.query.join(Coupon.eligible_products)
        .filter(Coupon.store_chain == store_chain)
        .filter_by(product_id=item.id)
        .all()
    )

    best = None
    best_price = base_price

    for c in coupons:
        eff = _effective_unit_price(base_price, c.coupon_type, c.discount)
        if eff is None:
            continue
        if eff < best_price:
            best_price = eff
            best = {
                "coupon_code": c.coupon_code,
                "title": c.title,
                "discount": c.discount,
                "coupon_type": c.coupon_type,
                "effective_unit_price": round(eff, 2),
                "source": "db_linked_coupon",
            }

    # Fallback hardcoded matching by title if DB-linking doesn't yield a better coupon.
    # Skip the hardcoded fallback for any coupon that has explicit DB-linked products for
    # this store — if the item isn't in that explicit list, it's not eligible.
    hard = hardcoded_coupon_for_title(item.title or "", store_chain, base_price, category=item.category)
    if hard and hard["effective_unit_price"] < best_price:
        db_coupon = Coupon.query.filter_by(store_chain=store_chain, title=hard["title"]).first()
        coupon_has_explicit_links = (
            db_coupon is not None
            and db.session.query(CouponProduct).filter_by(coupon_id=db_coupon.id).count() > 0
        )
        if not coupon_has_explicit_links:
            best = hard

    return best


def to_product_payload(item: GroceryItem, store_chain: Optional[str] = None, coupon_mode: bool = False):
    all_prices = {p.store_chain: p.price for p in item.prices}
    payload = {
        "product_id": item.id,
        "title": item.title,
        "brand": item.brand,
        "prices": all_prices,
        "image_url": item.image_url,
        "affiliate_link": item.affiliate_link,
        "availability": item.availability,
        "category": item.category,
        "keywords": json.loads(item.keywords) if item.keywords else [],
    }

    if store_chain:
        base = all_prices.get(store_chain)
        if base is not None:
            payload["selected_store"] = store_chain
            payload["base_unit_price"] = round(float(base), 2)
            payload["effective_unit_price"] = round(float(base), 2)

            if coupon_mode:
                applied = best_coupon_for_item(item, store_chain, float(base))
                if applied:
                    payload["applied_coupon"] = applied
                    payload["effective_unit_price"] = applied["effective_unit_price"]

    return payload

