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

# Each coupon has a "max_products" key controlling how many DB items to pin.
# Keywords should be specific enough to target only the intended product(s).
COUPONS = {
    "Walmart": [
        {
            "coupon_code": "WMMILK1",
            "title": "$1 Off Half Gallon of Milk",
            "description": "Save $1 on any Great Value whole, 2%, or skim milk gallon",
            "discount": "$1",
            "category": "Dairy",
            "expires_in": "5 days",
            "coupon_type": "dollar",
            "keywords": "gallon milk",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Bread 2 for $5",
            "description": "Mix & match any 2 loaves of sandwich bread (reg. $3.29 each)",
            "discount": "2 for $5",
            "category": "Bakery",
            "expires_in": "4 days",
            "coupon_type": "special",
            "keywords": "sandwich bread",
            "max_products": 2,
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
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "$2 Off Boneless Chicken Breast",
            "description": "Save $2 per lb on fresh boneless skinless chicken breast",
            "discount": "$2/lb",
            "category": "Meat",
            "expires_in": "3 days",
            "coupon_type": "special",
            "keywords": "boneless chicken breast",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Eggs 2 for $5",
            "description": "Any two dozen large eggs — mix and match brands (reg. $3.78 each)",
            "discount": "2 for $5",
            "category": "Dairy",
            "expires_in": "7 days",
            "coupon_type": "special",
            "keywords": "large eggs",
            "max_products": 2,
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
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Frozen Pizza 3 for $10",
            "description": "Mix & match any 3 DiGiorno or Tombstone frozen pizzas (reg. $4.49 each)",
            "discount": "3 for $10",
            "category": "Frozen",
            "expires_in": "4 days",
            "coupon_type": "special",
            "keywords": "digiorno pizza",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "BOGO Bananas",
            "description": "Buy one 5 lb bag of fresh bananas, get one free",
            "discount": "BOGO",
            "category": "Produce",
            "expires_in": "2 days",
            "coupon_type": "bogo",
            "keywords": "bananas",
            "max_products": 1,
        },
    ],
    "Aldi": [
        {
            "coupon_code": None,
            "title": "Ground Beef 2 for $11",
            "description": "Any two 1 lb packages of 90/10 ground beef",
            "discount": "2 for $11",
            "category": "Meat",
            "expires_in": "3 days",
            "coupon_type": "special",
            "keywords": "ground beef",
            "max_products": 1,
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
            "max_products": 1,
        },
        {
            "coupon_code": None,
            "title": "BOGO Specially Selected Cheese",
            "description": "Buy one, get one free on all Specially Selected sliced or shredded cheese (up to $4.29 value)",
            "discount": "BOGO",
            "category": "Dairy",
            "expires_in": "5 days",
            "coupon_type": "bogo",
            "keywords": "shredded cheese",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Salmon Fillet $2 Off",
            "description": "Save $2 on any fresh Atlantic salmon fillet (reg. $8.99/lb)",
            "discount": "$2",
            "category": "Seafood",
            "expires_in": "4 days",
            "coupon_type": "dollar",
            "keywords": "salmon fillet",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Greek Yogurt 3 for $5",
            "description": "Mix & match any 3 Chobani Greek yogurt drinks",
            "discount": "3 for $5",
            "category": "Dairy",
            "expires_in": "6 days",
            "coupon_type": "special",
            "keywords": "chobani greek yogurt drink",
            "max_products": 3,
        },
        {
            "coupon_code": None,
            "title": "$1.50 Off Dozen Eggs",
            "description": "Save $1.50 on a dozen large grade A eggs",
            "discount": "$1.50",
            "category": "Dairy",
            "expires_in": "3 days",
            "coupon_type": "dollar",
            "keywords": "large eggs",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Canned Beans 3 for $5",
            "description": "Any 3 cans of SimplyNature or Happy Harvest beans ",
            "discount": "3 for $5",
            "category": "Pantry",
            "expires_in": "7 days",
            "coupon_type": "special",
            "keywords": "canned beans",
            "max_products": 3,
        },
        {
            "coupon_code": None,
            "title": "$2 Off Rotisserie Chicken deli meat",
            "description": "Save $2 on any fresh whole rotisserie chicken ",
            "discount": "$2",
            "category": "Meat",
            "expires_in": "1 day",
            "coupon_type": "dollar",
            "keywords": "rotisserie chicken",
            "max_products": 1,
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
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Shrimp 2 for $12",
            "description": "Any two 12 oz bags of frozen cooked shrimp (reg. $7.99 each)",
            "discount": "2 for $12",
            "category": "Seafood",
            "expires_in": "4 days",
            "coupon_type": "special",
            "keywords": "cooked shrimp",
            "max_products": 2,
            "exact_titles": ["Cox's 41/50 Wild-Caught Key West Pink Raw Shrimp"],
        },
        {
            "coupon_code": None,
            "title": "BOGO Hannaford Orange Juice",
            "description": "Buy one, get one free on Hannaford brand 52 oz orange juice (up to $3.99 value)",
            "discount": "BOGO",
            "category": "Beverages",
            "expires_in": "5 days",
            "coupon_type": "bogo",
            "keywords": "orange juice",
            "max_products": 2,
        },
        {
            "coupon_code": "HFYOGURT",
            "title": "Greek Yogurt Buy 2 Get 1 Free",
            "description": "Purchase any 2 Chobani or Fage Greek yogurts, get a third free (up to $1.79 value)",
            "discount": "B2G1",
            "category": "Dairy",
            "expires_in": "6 days",
            "coupon_type": "bogo",
            "keywords": "chobani greek yogurt",
            "max_products": 3,
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
            "max_products": 2,
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
            "max_products": 2,
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
            "max_products": 1,
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
            "max_products": 3,
            "exact_titles": ["Barilla Mini Penne Pasta, Quality Non-GMO and Kosher Certified Pasta"],
        },
    ],
    "Price Chopper": [
        {
            "coupon_code": "PCMILK1",
            "title": "$1 Off Milk Gallon",
            "description": "Save $1 on any gallon of whole, 2%, or skim milk",
            "discount": "$1",
            "category": "Dairy",
            "expires_in": "5 days",
            "coupon_type": "dollar",
            "keywords": "milk gallon",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Chicken Breast 2 for $16",
            "description": "Any two 1 lb packages of fresh boneless skinless chicken breast ",
            "discount": "2 for $16",
            "category": "Meat",
            "expires_in": "4 days",
            "coupon_type": "special",
            "keywords": "boneless chicken breast",
            "max_products": 2,
            "exact_titles": ["Perdue\ufffd Harvestland\ufffd Individually Wrapped Boneless Skinless Chicken Breast"],
        },
        {
            "coupon_code": None,
            "title": "BOGO Pasta Sauce",
            "description": "Buy one, get one free on any Ragu or Prego pasta sauce (up to $3.99 value)",
            "discount": "BOGO",
            "category": "Pantry",
            "expires_in": "6 days",
            "coupon_type": "bogo",
            "keywords": "pasta sauce",
            "max_products": 2,
        },
        {
            "coupon_code": "PCEGG2",
            "title": "$1.50 Off Dozen Eggs",
            "description": "Save $1.50 on any dozen large grade A eggs",
            "discount": "$1.50",
            "category": "Dairy",
            "expires_in": "3 days",
            "coupon_type": "dollar",
            "keywords": "large eggs",
            "max_products": 2,
        },
        {
            "coupon_code": None,
            "title": "Yogurt 4 for $5",
            "description": "Mix & match any 4 single-serve Greek yogurt cups (reg. $1.49 each)",
            "discount": "4 for $5",
            "category": "Dairy",
            "expires_in": "7 days",
            "coupon_type": "special",
            "keywords": "greek yogurt",
            "max_products": 3,
            "max_price": 3.00,
        },
        {
            "coupon_code": None,
            "title": "$1 Off Fresh Strawberries",
            "description": "Save $1 on any 1 lb container of fresh strawberries",
            "discount": "$1",
            "category": "Produce",
            "expires_in": "2 days",
            "coupon_type": "dollar",
            "keywords": "strawberries",
            "max_products": 1,
        },
        {
            "coupon_code": None,
            "title": "Frozen Vegetables 3 for $15",
            "description": "Mix & match any 3 bags of frozen vegetables (reg. $2.29 each)",
            "discount": "3 for $15",
            "category": "Frozen",
            "expires_in": "5 days",
            "coupon_type": "special",
            "keywords": "frozen vegetables",
            "max_products": 3,
        },
        {
            "coupon_code": "PCBREAD",
            "title": "$1.50 Off Sandwich Bread",
            "description": "Save $1.50 on any loaf of sandwich bread (20 oz or larger)",
            "discount": "$1.50",
            "category": "Bakery",
            "expires_in": "4 days",
            "coupon_type": "dollar",
            "keywords": "sandwich bread",
            "max_products": 2,
        },
    ],
}


def find_products_for_coupon(chain, keywords, category, max_results=2, exact_titles=None, max_price=None):
    """Return up to max_results GroceryItem IDs that best match the coupon keywords."""
    from models import ItemStoreAvailability, ItemPrice

    # If exact titles are provided, look those up directly and skip keyword search
    if exact_titles:
        ids = []
        for t in exact_titles:
            item = GroceryItem.query.filter(
                GroceryItem.title.ilike(t)
            ).first()
            if item:
                ids.append(item.id)
            else:
                print(f"    WARNING: exact title not found: {t!r}".encode("ascii", "replace").decode("ascii"))
        return ids

    if not keywords:
        return []
    available_ids = db.session.query(ItemStoreAvailability.item_id).filter_by(
        store_chain=chain
    ).scalar_subquery()

    def base_query(cat):
        q = GroceryItem.query.filter(GroceryItem.id.in_(available_ids))
        if cat:
            q = q.filter_by(category=cat)
        if max_price is not None:
            q = q.join(ItemPrice, (ItemPrice.item_id == GroceryItem.id) & (ItemPrice.store_chain == chain))
            q = q.filter(ItemPrice.price <= max_price)
        return q

    # 1. Try exact phrase match in the given category
    results = base_query(category).filter(
        GroceryItem.title.ilike(f"%{keywords}%")
    ).limit(max_results).all()

    # 2. If nothing, try all-terms AND match in the given category
    if not results:
        terms = [t.strip() for t in keywords.split() if len(t.strip()) > 2]
        q = base_query(category)
        for term in terms:
            q = q.filter(GroceryItem.title.ilike(f"%{term}%"))
        results = q.limit(max_results).all()

    # 3. If still nothing, drop the category restriction and try the full phrase
    if not results:
        results = base_query(None).filter(
            GroceryItem.title.ilike(f"%{keywords}%")
        ).limit(max_results).all()

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
                    chain, deal.get("keywords"), deal.get("category"),
                    max_results=deal.get("max_products", 2),
                    exact_titles=deal.get("exact_titles"),
                    max_price=deal.get("max_price"),
                )
                for pid in product_ids:
                    db.session.add(CouponProduct(coupon_id=coupon.id, product_id=pid))
                    linked += 1

                if product_ids:
                    print(f"  [{chain}] '{deal['title']}' -> product IDs {product_ids}")
                else:
                    print(f"  [{chain}] '{deal['title']}' -> no matching products found")

                inserted += 1

        db.session.commit()
        print(f"\nSeeded {inserted} coupons with {linked} product links across {len(COUPONS)} store chains.")


if __name__ == "__main__":
    seed()
