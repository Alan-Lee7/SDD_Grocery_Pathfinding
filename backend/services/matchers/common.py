import json
from typing import List
from models import GroceryItem, ItemPrice, ItemStoreAvailability
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


def to_product_payload(item: GroceryItem):
    all_prices = {p.store_chain: p.price for p in item.prices}
    return {
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


def get_store_price(item: GroceryItem, store_chain: str) -> float:
    price = ItemPrice.query.filter_by(item_id=item.id, store_chain=store_chain).first()
    return price.price if price else float("inf")
