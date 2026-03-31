import json
import re
from typing import List, Optional, Dict
from models import GroceryItem, ItemPrice, ItemStoreAvailability, Coupon
from database import db


def items_available_at_store(store_chain: str) -> List[GroceryItem]:
    available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(store_chain=store_chain).all()
    available_ids = {row[0] for row in available_ids}
    if not available_ids:
        return []
    return GroceryItem.query.filter(GroceryItem.id.in_(available_ids)).all()


def match_candidates(raw_input: str, items_at_store: List[GroceryItem]) -> List[GroceryItem]:
    lowercase_input = raw_input.lower()
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


def best_coupon_for_item(item_id: int, store_chain: str, base_price: float) -> Optional[Dict]:
    coupons = (
        Coupon.query.join(Coupon.eligible_products)
        .filter(Coupon.store_chain == store_chain)
        .filter_by(product_id=item_id)
        .all()
    )
    if not coupons:
        return None

    best = None
    best_price = base_price

    for c in coupons:
        eff = _effective_unit_price(base_price, c.coupon_type, c.discount)
        if eff is None:
            continue
        if eff < best_price:
            best_price = eff
            best = c

    if best is None:
        return None

    return {
        "coupon_code": best.coupon_code,
        "title": best.title,
        "discount": best.discount,
        "coupon_type": best.coupon_type,
        "effective_unit_price": round(best_price, 2),
    }


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
                applied = best_coupon_for_item(item.id, store_chain, float(base))
                if applied:
                    payload["applied_coupon"] = applied
                    payload["effective_unit_price"] = applied["effective_unit_price"]

    return payload
