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


def _relevance_score(input_words: set, keywords: list) -> float:
    """
    Score how relevant an item is to the search.
    Higher = better match. Uses matched_words / total_keywords so that items
    where the search term represents a larger share of the description rank first
    (e.g. a 4-keyword bread loaf beats a 10-keyword banana-bread bar).
    """
    if not keywords:
        return 0.0
    keyword_set = {kw.lower() for kw in keywords}
    matched = len(input_words & keyword_set)
    if matched == 0:
        return 0.0
    return matched / len(keyword_set)


def match_candidates(raw_input: str, items_at_store: List[GroceryItem]) -> List[GroceryItem]:
    lowercase_input = raw_input.lower()
    input_words = set(lowercase_input.split())
    scored = []
    for item in items_at_store:
        keywords = json.loads(item.keywords) if item.keywords else []
        keyword_set = {kw.lower() for kw in keywords}
        # A keyword phrase is contained in the user's search (e.g. keyword "bread" in search "sourdough bread")
        # OR one of the user's search words exactly matches a keyword (whole-word, not substring)
        if any(kw.lower() in lowercase_input for kw in keywords) or \
                any(word in keyword_set for word in input_words):
            score = _relevance_score(input_words, keywords)
            scored.append((score, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in scored]


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
