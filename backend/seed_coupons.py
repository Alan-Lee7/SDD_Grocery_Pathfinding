"""
Seed script: populates the Coupon table with store-specific deals.

Run from the backend/ directory:
    python seed_coupons.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from database import db
from models import Coupon, Store, CouponProduct, GroceryItem

COUPONS = {
    "Walmart": [
        {
            "coupon_code": "WMMILK1",
            "title": "$1 Off Great Value Milk",
            "description": "Save $1 on any Great Value whole, 2%, or skim milk gallon",
            "discount": "$1",
            "category": "Dairy",
            "expires_in": "5 days",
            "coupon_type": "dollar",
            "keywords": "milk",
        },
        {
            "coupon_code": None,
            "title": "Bread 2 for $5",
            "description": "Mix & match any 2 loaves of sandwich bread (reg. $3.29 each)",
            "discount": "2 for $5",
            "category": "Bakery",
            "expires_in": "4 days",
            "coupon_type": "special",
            "keywords": "bread",
        },
        {
            "coupon_code": None,
            "title": "BOGO Pasta Sauce",
            "description": "Buy one Prego or Ragu pasta sauce, get one free (up to $3.50 value)",
            "discount": "BOGO",
            "category": "Pantry",
            "expires_in": "6 days",
            "coupon_type": "bogo",
            "keywords": "pasta sauce",
        },
        {
            "coupon_code": None,
            "title": "$2 Off Boneless Chicken Breast",
            "description": "Save $2 per lb on fresh boneless skinless chicken breast",
            "discount": "$2/lb",
            "category": "Meat",
            "expires_in": "3 days",
            "coupon_type": "special",
            "keywords": "chicken breast",
        },
        {
            "coupon_code": None,
            "title": "Eggs 2 for $6",
            "description": "Any two dozen large eggs — mix and match brands (reg. $3.78 each)",
            "discount": "2 for $6",
            "category": "Dairy",
            "expires_in": "7 days",
            "coupon_type": "special",
            "keywords": "eggs",
        },
        {
            "coupon_code": "WMCHEER",
            "title": "$1.50 Off Cheerios",
            "description": "Save $1.50 on any one box of Cheerios (8.9 oz or larger)",
            "discount": "$1.50",
            "category": "Pantry",
            "expires_in": "5 days",
            "coupon_type": "dollar",
            "keywords": "cheerios",
        },
        {
            "coupon_code": None,
            "title": "Frozen Pizza 3 for $10",
            "description": "Mix & match any 3 DiGiorno or Tombstone frozen pizzas (reg. $4.49 each)",
            "discount": "3 for $10",
            "category": "Frozen",
            "expires_in": "4 days",
            "coupon_type": "special",
            "keywords": "frozen pizza",
        },
        {
            "coupon_code": None,
            "title": "$1 Off Bananas (5 lb bag)",
            "description": "Save $1 on a 5 lb bag of fresh bananas",
            "discount": "$1",
            "category": "Produce",
            "expires_in": "2 days",
            "coupon_type": "dollar",
            "keywords": "bananas",
        },
    ],
    "Aldi": [
        {
            "coupon_code": None,
            "title": "Ground Beef 2 for $9",
            "description": "Any two 1 lb packages of 80/20 ground beef (reg. $5.29 each)",
            "discount": "2 for $9",
            "category": "Meat",
            "expires_in": "3 days",
            "coupon_type": "special",
            "keywords": "ground beef",
        },
        {
            "coupon_code": None,
            "title": "$1 Off Strawberries",
            "description": "Save $1 on any 1 lb container of fresh strawberries",
            "discount": "$1",
            "category": "Produce",
            "expires_in": "2 days",
            "coupon_type": "dollar",
            "keywords": "strawberries",
        },
        {
            "coupon_code": None,
            "title": "BOGO Specially Selected Cheese",
            "description": "Buy one, get one free on all Specially Selected sliced or shredded cheese (up to $4.29 value)",
            "discount": "BOGO",
            "category": "Dairy",
            "expires_in": "5 days",
            "coupon_type": "bogo",
            "keywords": "cheese",
        },
        {
            "coupon_code": None,
            "title": "Salmon Fillet $2 Off",
            "description": "Save $2 on any fresh Atlantic salmon fillet (reg. $8.99/lb)",
            "discount": "$2",
            "category": "Seafood",
            "expires_in": "4 days",
            "coupon_type": "dollar",
            "keywords": "salmon",
        },
        {
            "coupon_code": None,
            "title": "Greek Yogurt 4 for $5",
            "description": "Mix & match any 4 Friendly Farms Greek yogurt cups (reg. $1.49 each)",
            "discount": "4 for $5",
            "category": "Dairy",
            "expires_in": "6 days",
            "coupon_type": "special",
            "keywords": "greek yogurt",
        },
        {
            "coupon_code": None,
            "title": "$1.50 Off Dozen Eggs",
            "description": "Save $1.50 on a dozen large grade A eggs",
            "discount": "$1.50",
            "category": "Dairy",
            "expires_in": "3 days",
            "coupon_type": "dollar",
            "keywords": "eggs",
        },
        {
            "coupon_code": None,
            "title": "Canned Beans 5 for $4",
            "description": "Any 5 cans of SimplyNature or Happy Harvest beans (reg. $0.99 each)",
            "discount": "5 for $4",
            "category": "Pantry",
            "expires_in": "7 days",
            "coupon_type": "special",
            "keywords": "beans",
        },
        {
            "coupon_code": None,
            "title": "$2 Off Whole Rotisserie Chicken",
            "description": "Save $2 on any fresh whole rotisserie chicken (reg. $6.99)",
            "discount": "$2",
            "category": "Meat",
            "expires_in": "1 day",
            "coupon_type": "dollar",
            "keywords": "rotisserie chicken",
        },
    ],
    "Hannaford": [
        {
            "coupon_code": "HFBREAD",
            "title": "$2 Off Hannaford Artisan Bread",
            "description": "Save $2 on any Hannaford bakery fresh-baked artisan loaf (reg. $4.99)",
            "discount": "$2",
            "category": "Bakery",
            "expires_in": "3 days",
            "coupon_type": "dollar",
            "keywords": "artisan bread",
        },
        {
            "coupon_code": None,
            "title": "Shrimp 2 for $12",
            "description": "Any two 12 oz bags of frozen cooked shrimp (reg. $7.99 each)",
            "discount": "2 for $12",
            "category": "Seafood",
            "expires_in": "4 days",
            "coupon_type": "special",
            "keywords": "shrimp",
        },
        {
            "coupon_code": None,
            "title": "BOGO Hannaford Orange Juice",
            "description": "Buy one, get one free on Hannaford brand 52 oz orange juice (up to $3.99 value)",
            "discount": "BOGO",
            "category": "Dairy",
            "expires_in": "5 days",
            "coupon_type": "bogo",
            "keywords": "orange juice",
        },
        {
            "coupon_code": "HFYOGURT",
            "title": "Greek Yogurt Buy 2 Get 1 Free",
            "description": "Purchase any 2 Chobani or Fage Greek yogurts, get a third free (up to $1.79 value)",
            "discount": "B2G1",
            "category": "Dairy",
            "expires_in": "6 days",
            "coupon_type": "bogo",
            "keywords": "greek yogurt",
        },
        {
            "coupon_code": "HFBAR",
            "title": "$1.50 Off Nature Valley Bars",
            "description": "Save $1.50 on any one box of Nature Valley granola bars",
            "discount": "$1.50",
            "category": "Pantry",
            "expires_in": "7 days",
            "coupon_type": "dollar",
            "keywords": "nature valley",
        },
        {
            "coupon_code": None,
            "title": "Pork Chops 2 for $10",
            "description": "Any two 1 lb packages of bone-in pork chops (reg. $5.99 each)",
            "discount": "2 for $10",
            "category": "Meat",
            "expires_in": "3 days",
            "coupon_type": "special",
            "keywords": "pork chops",
        },
        {
            "coupon_code": None,
            "title": "$1 Off Avocados (bag of 4)",
            "description": "Save $1 on any bag of 4 fresh Hass avocados (reg. $4.49)",
            "discount": "$1",
            "category": "Produce",
            "expires_in": "2 days",
            "coupon_type": "dollar",
            "keywords": "avocados",
        },
        {
            "coupon_code": None,
            "title": "Pasta 3 for $4",
            "description": "Mix & match any 3 boxes of Barilla or Hannaford brand pasta (reg. $1.79 each)",
            "discount": "3 for $4",
            "category": "Pantry",
            "expires_in": "5 days",
            "coupon_type": "special",
            "keywords": "pasta",
        },
    ],
}


def find_products_for_coupon(chain, keywords, category, max_results=2):
    """Return up to max_results GroceryItem IDs that best match the coupon keywords."""
    if not keywords:
        return []
    terms = [t.strip() for t in keywords.split() if len(t.strip()) > 2]
    if not terms:
        return []

    # Build a query scoped to the store chain and category
    from models import ItemStoreAvailability
    available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(
        store_chain=chain
    ).scalar_subquery()
    query = GroceryItem.query.filter(GroceryItem.id.in_(available_ids))
    if category:
        query = query.filter_by(category=category)

    # Filter to items whose title contains ALL keyword terms
    for term in terms:
        query = query.filter(GroceryItem.title.ilike(f"%{term}%"))

    results = query.limit(max_results).all()

    # If no results with all terms, try with the full phrase
    if not results:
        query2 = GroceryItem.query.filter(GroceryItem.id.in_(available_ids))
        if category:
            query2 = query2.filter_by(category=category)
        query2 = query2.filter(GroceryItem.title.ilike(f"%{keywords}%"))
        results = query2.limit(max_results).all()

    return [r.id for r in results]


def seed():
    app = create_app()
    with app.app_context():
        # Clear existing coupon-product links and coupons
        CouponProduct.query.delete()
        Coupon.query.delete()
        db.session.commit()

        inserted = 0
        linked = 0
        for chain, deals in COUPONS.items():
            # Pick the first store of this chain to satisfy the FK
            store = Store.query.filter_by(chain=chain).first()
            if not store:
                print(f"  WARNING: No store found for chain '{chain}', skipping.")
                continue

            for deal in deals:
                coupon = Coupon(
                    coupon_code=deal["coupon_code"],
                    store_id=store.id,
                    store_chain=chain,
                    title=deal["title"],
                    description=deal["description"],
                    discount=deal["discount"],
                    category=deal["category"],
                    expires_in=deal["expires_in"],
                    coupon_type=deal["coupon_type"],
                    keywords=deal.get("keywords"),
                )
                db.session.add(coupon)
                db.session.flush()  # get coupon.id

                product_ids = find_products_for_coupon(
                    chain, deal.get("keywords"), deal.get("category")
                )
                for pid in product_ids:
                    db.session.add(CouponProduct(coupon_id=coupon.id, product_id=pid))
                    linked += 1

                if product_ids:
                    print(f"  [{chain}] '{deal['title']}' → product IDs {product_ids}")
                else:
                    print(f"  [{chain}] '{deal['title']}' → no matching products found")

                inserted += 1

        db.session.commit()
        print(f"\nSeeded {inserted} coupons with {linked} product links across {len(COUPONS)} store chains.")


if __name__ == "__main__":
    seed()
