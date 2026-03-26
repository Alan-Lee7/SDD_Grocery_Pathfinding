"""
Seed script: populates ItemPrice for all GroceryItems that have no prices yet.

Prices are generated based on realistic category averages, then scaled per chain.

Run from the backend/ directory:
    python seed_prices.py
"""

import sys
import os
import random

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from database import db
from models import GroceryItem, ItemPrice

# Base price ranges per category (min, max) in USD
CATEGORY_PRICE_RANGES = {
    "Produce":       (0.79,  5.99),
    "Bakery":        (2.49,  6.99),
    "Deli":          (3.99,  9.99),
    "Meat":          (4.99, 15.99),
    "Seafood":       (5.99, 19.99),
    "Dairy":         (1.49,  6.99),
    "Frozen":        (2.49,  8.99),
    "Beverages":     (0.99,  5.99),
    "Snacks":        (1.99,  5.99),
    "Cereal":        (2.99,  6.99),
    "Canned Goods":  (0.89,  3.99),
    "Pasta":         (1.29,  4.99),
    "Condiments":    (1.99,  6.99),
    "Baking":        (1.49,  5.99),
    "Personal Care": (2.99,  9.99),
    "Cleaning":      (2.99, 10.99),
    "Baby":          (4.99, 24.99),
    "Pet":           (4.99, 29.99),
    "Health":        (4.99, 16.99),
    "Natural":       (2.99,  8.99),
    "Organic":       (2.99,  8.99),
    "Other":         (1.99,  9.99),
}

# Price multiplier per chain relative to a neutral baseline
CHAIN_MULTIPLIERS = {
    "Kroger":        1.00,
    "Price Chopper": 1.05,
    "Hannaford":     1.08,
    "Walmart":       0.92,
    "Aldi":          0.78,
}


def base_price_for(category):
    lo, hi = CATEGORY_PRICE_RANGES.get(category, (1.99, 9.99))
    # Use a slightly skewed distribution — most items cluster near the lower third
    return round(random.triangular(lo, hi, lo + (hi - lo) * 0.35), 2)


def seed():
    app = create_app()
    with app.app_context():
        # Only process items that have no prices yet
        priced_ids = {p.item_id for p in ItemPrice.query.with_entities(ItemPrice.item_id).all()}
        items = GroceryItem.query.filter(~GroceryItem.id.in_(priced_ids)).all() if priced_ids else GroceryItem.query.all()

        total = len(items)
        if total == 0:
            print("All items already have prices.")
            return

        print(f"Adding prices for {total} items across {len(CHAIN_MULTIPLIERS)} chains...")

        batch_size = 500
        added = 0

        for i, item in enumerate(items):
            base = base_price_for(item.category)
            for chain, multiplier in CHAIN_MULTIPLIERS.items():
                jitter = random.uniform(-0.03, 0.03)
                price = round(base * multiplier * (1 + jitter), 2)
                price = max(price, 0.25)
                db.session.add(ItemPrice(item_id=item.id, store_chain=chain, price=price))

            added += 1
            if added % batch_size == 0:
                db.session.commit()
                print(f"  {added}/{total} items priced...")

        db.session.commit()
        print(f"Done. Priced {added} items across {len(CHAIN_MULTIPLIERS)} chains ({added * len(CHAIN_MULTIPLIERS):,} price rows added).")


if __name__ == "__main__":
    seed()
