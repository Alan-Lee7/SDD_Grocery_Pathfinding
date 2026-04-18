"""
Seed script: fetches product catalog from the Kroger Developer API and populates
GroceryItem, ItemPrice, and ItemStoreAvailability tables.

Prerequisites:
    pip install requests

Notes:
    - Kroger API limit: 10,000 product calls/day. This script uses ~600-800 calls
      to retrieve ~3,000-6,000 unique products.
    - Products are seeded with Kroger prices. All other store chains in your DB
      receive the same items with a ±15% price variation.
    - Re-running is safe — existing items are skipped by productId.
"""

import sys
import os
import json
import time
import base64
import random

import requests
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(__file__))

# Load .env from the backend/ directory
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from app import create_app
from database import db
from models import GroceryItem, ItemPrice, ItemStoreAvailability

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CLIENT_ID     = os.environ.get("KROGER_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("KROGER_CLIENT_SECRET", "")
TARGET_ZIP    = os.environ.get("KROGER_ZIP", "12180")

KROGER_BASE   = "https://api.kroger.com/v1"

# All store chains we want to populate (must match chain values in  Store table)
STORE_CHAINS = ["Price Chopper", "Hannaford", "Walmart", "Aldi", "Kroger"]

# Price multipliers per chain relative to Kroger's price (1.0 = same price)
CHAIN_PRICE_MULTIPLIERS = {
    "Kroger":        1.00,
    "Price Chopper": 1.05,
    "Hannaford":     1.08,
    "Walmart":       0.92,
    "Aldi":          0.78,
}

# ---------------------------------------------------------------------------
# Kroger category →  model's category string mapping
# ---------------------------------------------------------------------------
CATEGORY_MAP = {
    # Perishables / fresh departments
    "Produce":              "Produce",
    "Organic":              "Produce",
    "Natural":              "Produce",
    "Bakery":               "Bakery",
    "Bread":                "Bakery",
    "Tortilla":             "Bakery",
    "Deli":                 "Deli",
    "Prepared Foods":       "Deli",
    "Meat":                 "Meat",
    "Poultry":              "Meat",
    "Seafood":              "Seafood",
    "Fish":                 "Seafood",
    "Dairy":                "Dairy",
    "Cheese":               "Dairy",
    "Eggs":                 "Dairy",
    "Milk":                 "Dairy",
    # Frozen
    "Frozen":               "Frozen",
    # Beverages
    "Beverages":            "Beverages",
    "Juice":                "Beverages",
    "Water":                "Beverages",
    "Coffee":               "Beverages",
    "Tea":                  "Beverages",
    "Soft Drink":           "Beverages",
    "Energy Drink":         "Beverages",
    "Sports Drink":         "Beverages",
    # Snacks — must be checked before "Breakfast" to avoid granola bars → Cereal
    "Snacks":               "Snacks",
    "Candy":                "Snacks",
    "Chips":                "Snacks",
    "Crackers":             "Snacks",
    "Cookies":              "Snacks",
    "Nuts":                 "Snacks",
    # Cereal / Breakfast — only actual cereals/hot cereals
    "Breakfast Cereal":     "Cereal",
    "Hot Cereal":           "Cereal",
    "Cereal":               "Cereal",
    "Oatmeal":              "Cereal",
    "Granola Cereal":       "Cereal",
    # Breakfast bakery items → Bakery (more specific, checked before "Bakery" key)
    "Breakfast Bakery":     "Bakery",
    "Breakfast Pastry":     "Bakery",
    "Muffins":              "Bakery",
    "Donuts":               "Bakery",
    "Cinnamon Rolls":       "Bakery",
    "Croissants":           "Bakery",
    "Danishes":             "Bakery",
    # Pasta / Rice / Dry Packaged Meals — ordered before "Canned" to take priority
    "Pasta":                "Pasta",
    "Rice":                 "Pasta",
    "Grains":               "Pasta",
    "Noodles":              "Pasta",
    "Side Dish":            "Pasta",      # instant mashed potatoes, stuffing, etc.
    "Boxed Dinner":         "Pasta",
    "Boxed Meals":          "Pasta",
    "Mac":                  "Pasta",
    "Potatoes":             "Pasta",
    # Canned / Jarred Goods — only truly canned/jarred shelf-stable products
    "Canned Goods":         "Canned Goods",
    "Canned Food":          "Canned Goods",
    "Canned":               "Canned Goods",
    "Jarred":               "Canned Goods",
    "Canned Soup":          "Canned Goods",
    "Canned Broth":         "Canned Goods",
    "Canned Tomato":        "Canned Goods",
    # Condiments
    "Condiments":           "Condiments",
    "Sauces":               "Condiments",
    "Salad Dressing":       "Condiments",
    "Oils":                 "Condiments",
    "Vinegar":              "Condiments",
    "Spreads":              "Condiments",
    "Jams":                 "Condiments",
    # Baking
    "Baking":               "Baking",
    "Bake":                 "Baking",
    "Cake Mix":             "Baking",
    "Spices":               "Baking",
    "Herbs":                "Baking",
    "Extracts":             "Baking",
    # Non-food
    "Personal Care":        "Personal Care",
    "Beauty":               "Personal Care",
    "Hair Care":            "Personal Care",
    "Cleaning":             "Cleaning",
    "Household":            "Cleaning",
    "Laundry":              "Cleaning",
    "Baby":                 "Baby",
    "Infant":               "Baby",
    "Pet":                  "Pet",
    "Dog":                  "Pet",
    "Cat":                  "Pet",
    "Health":               "Health",
    "Medicine":             "Health",
    "Pharmacy":             "Health",
    "Vitamins":             "Health",
}

# ---------------------------------------------------------------------------
# Search terms — broad enough to cover the whole store, deduplicated by API
# ---------------------------------------------------------------------------
SEARCH_TERMS = [
    # Produce
    "apple", "banana", "orange", "strawberry", "blueberry", "grape", "mango",
    "avocado", "lemon", "lime", "peach", "pear", "pineapple", "watermelon",
    "broccoli", "spinach", "lettuce", "kale", "tomato", "potato", "onion",
    "garlic", "carrot", "celery", "cucumber", "pepper", "mushroom", "zucchini",
    "corn", "asparagus", "cauliflower",
    # Meat & Seafood
    "chicken breast", "ground beef", "steak", "pork chop", "bacon", "sausage",
    "salmon", "tilapia", "shrimp", "tuna steak", "turkey breast",
    # Dairy
    "milk", "butter", "yogurt", "cheese", "eggs", "cream cheese", "sour cream",
    "cottage cheese", "heavy cream", "half and half", "almond milk", "oat milk",
    # Bakery & Bread
    "bread", "bagel", "muffin", "croissant", "tortilla", "pita", "rolls",
    "english muffin", "sourdough",
    # Frozen
    "frozen pizza", "frozen vegetables", "ice cream", "frozen meals",
    "frozen burritos", "frozen waffles", "frozen chicken", "frozen fish",
    "frozen fruit",
    # Beverages
    "water", "orange juice", "apple juice", "soda", "coffee", "tea",
    "energy drink", "sports drink", "sparkling water", "lemonade",
    # Snacks
    "chips", "crackers", "popcorn", "pretzels", "almonds", "granola bar",
    "trail mix", "candy", "chocolate bar", "cookies",
    # Cereal & Breakfast
    "cereal", "oatmeal", "granola", "pancake mix", "syrup", "breakfast bar",
    # Canned Goods
    "canned tomatoes", "canned beans", "canned soup", "canned tuna",
    "canned corn", "canned fruit", "canned chicken", "tomato sauce",
    "chicken broth", "vegetable broth",
    # Pasta, Rice & Grains
    "pasta", "spaghetti", "rice", "quinoa", "ramen noodles", "couscous",
    "lentils", "mac and cheese",
    # Condiments & Sauces
    "ketchup", "mustard", "mayonnaise", "salad dressing", "hot sauce",
    "olive oil", "vegetable oil", "vinegar", "soy sauce", "salsa",
    "ranch dressing", "barbecue sauce", "sriracha",
    # Baking
    "flour", "sugar", "brown sugar", "baking soda", "baking powder",
    "vanilla extract", "chocolate chips", "cocoa powder", "yeast",
    "powdered sugar",
    # Personal Care
    "shampoo", "conditioner", "body wash", "toothpaste", "deodorant",
    "lotion", "razor", "facial wash", "hand soap",
    # Cleaning & Household
    "dish soap", "laundry detergent", "paper towels", "toilet paper",
    "cleaning spray", "sponge", "trash bags", "dryer sheets", "bleach",
    # Baby
    "baby food", "diapers", "baby formula", "baby wipes",
    # Pet
    "dog food", "cat food", "cat litter", "dog treats", "cat treats",
    # Health
    "vitamins", "pain reliever", "cold medicine", "bandages", "antacid",
    "allergy medicine", "multivitamin",
    # Deli
    "deli turkey", "deli ham", "salami", "hummus", "deli cheese",
]

# ---------------------------------------------------------------------------
# OAuth helpers
# ---------------------------------------------------------------------------
_token_cache = {"token": None, "expires_at": 0}


def get_access_token():
    """Returns a valid Bearer token, refreshing if expired."""
    now = time.time()
    if _token_cache["token"] and now < _token_cache["expires_at"] - 60:
        return _token_cache["token"]

    credentials = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    resp = requests.post(
        f"{KROGER_BASE}/connect/oauth2/token",
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data="grant_type=client_credentials&scope=product.compact",
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()
    _token_cache["token"] = data["access_token"]
    _token_cache["expires_at"] = now + data.get("expires_in", 1800)
    return _token_cache["token"]


def kroger_get(path, params=None):
    """Authenticated GET to the Kroger API. Retries once on 401."""
    for attempt in range(2):
        token = get_access_token()
        resp = requests.get(
            f"{KROGER_BASE}{path}",
            headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
            params=params,
            timeout=15,
        )
        if resp.status_code == 401 and attempt == 0:
            _token_cache["token"] = None  # force refresh
            continue
        if resp.status_code == 429:
            print("  Rate limited — sleeping 60s")
            time.sleep(60)
            continue
        resp.raise_for_status()
        return resp.json()
    return {}


# ---------------------------------------------------------------------------
# Locations helper — find nearest Kroger store to a ZIP
# ---------------------------------------------------------------------------
def get_location_id(zip_code):
    print(f"Finding nearest Kroger to ZIP {zip_code}...")
    data = kroger_get("/locations", {
        "filter.zipCode.near": zip_code,
        "filter.brand.name": "Kroger",
        "filter.limit": 1,
    })
    locations = data.get("data", [])
    if not locations:
        # Try without brand filter — some regions use banner names
        data = kroger_get("/locations", {
            "filter.zipCode.near": zip_code,
            "filter.limit": 1,
        })
        locations = data.get("data", [])
    if not locations:
        print("  WARNING: No Kroger location found. Prices will not be populated.")
        return None
    loc = locations[0]
    loc_id = loc["locationId"]
    name = loc.get("name", loc_id)
    print(f"  Using store: {name} (id={loc_id})")
    return loc_id


# ---------------------------------------------------------------------------
# Product fetching
# ---------------------------------------------------------------------------
def fetch_products_for_term(term, location_id, max_pages=5):
    """
    Fetches up to max_pages * 50 products for a single search term.
    Returns a list of raw product dicts from the API.
    """
    products = []
    for page in range(max_pages):
        start = page * 50
        params = {
            "filter.term": term,
            "filter.limit": 50,
            "filter.start": start,
        }
        if location_id:
            params["filter.locationId"] = location_id

        try:
            data = kroger_get("/products", params)
        except requests.HTTPError as e:
            print(f"    HTTP error for '{term}' page {page}: {e}")
            break

        batch = data.get("data", [])
        if not batch:
            break

        products.extend(batch)

        meta = data.get("meta", {}).get("pagination", {})
        total = meta.get("total", 0)
        fetched_so_far = start + len(batch)
        if fetched_so_far >= total:
            break

        # Polite delay to avoid rate-limiting
        time.sleep(0.25)

    return products


# ---------------------------------------------------------------------------
# Model mapping
# ---------------------------------------------------------------------------
def parse_category(raw_categories):
    """Map Kroger's category list to our category string.

    Match longer keys first so specific phrases (e.g. 'Side Dish') take
    priority over short broad ones (e.g. 'Canned').
    """
    sorted_map = sorted(CATEGORY_MAP.items(), key=lambda kv: len(kv[0]), reverse=True)
    for raw in (raw_categories or []):
        for key, mapped in sorted_map:
            if key.lower() in raw.lower():
                return mapped
    return "Other"


def parse_image_url(images):
    """Pick the best front-facing medium image URL."""
    for img in (images or []):
        if img.get("perspective") == "front":
            for size_obj in img.get("sizes", []):
                if size_obj.get("size") == "medium":
                    return size_obj.get("url")
    # fallback: any image
    for img in (images or []):
        for size_obj in img.get("sizes", []):
            if size_obj.get("url"):
                return size_obj.get("url")
    return None


def parse_price(product):
    """Extract regular price from first item entry."""
    for item in product.get("items", []):
        price = item.get("price", {})
        regular = price.get("regular")
        if regular and regular > 0:
            return float(regular)
    return None


def parse_keywords(product):
    """Build a keyword list from description + brand + categories."""
    words = set()
    desc = product.get("description", "")
    brand = product.get("brand", "")
    for token in (desc + " " + brand).lower().split():
        clean = token.strip("®™,.()")
        if len(clean) > 2:
            words.add(clean)
    for cat in product.get("categories", []):
        words.add(cat.lower())
    return json.dumps(sorted(words))


# ---------------------------------------------------------------------------
# Main seed logic
# ---------------------------------------------------------------------------
def seed():
    if not CLIENT_ID or not CLIENT_SECRET:
        print(
            "ERROR: Set KROGER_CLIENT_ID and KROGER_CLIENT_SECRET environment variables.\n"
            "  Register a free app at https://developer.kroger.com"
        )
        sys.exit(1)

    app = create_app()
    with app.app_context():
        location_id = get_location_id(TARGET_ZIP)

        # Load existing productIds to skip duplicates
        existing_ids = {
            item.affiliate_link
            for item in GroceryItem.query.with_entities(GroceryItem.affiliate_link).all()
            if item.affiliate_link
        }
        print(f"Existing items in DB: {len(existing_ids)}")

        seen_product_ids = set(existing_ids)
        added = 0
        skipped = 0
        api_calls = 0

        total_terms = len(SEARCH_TERMS)
        for idx, term in enumerate(SEARCH_TERMS):
            print(f"[{idx+1}/{total_terms}] Searching '{term}'...")

            raw_products = fetch_products_for_term(term, location_id, max_pages=5)
            api_calls += min(5, (len(raw_products) // 50) + 1)

            new_this_term = 0
            for prod in raw_products:
                product_id = prod.get("productId") or prod.get("upc")
                if not product_id or product_id in seen_product_ids:
                    skipped += 1
                    continue
                seen_product_ids.add(product_id)

                title = prod.get("description", "").strip()
                if not title:
                    continue

                brand_raw = prod.get("brand", "store").strip()
                # "store" brand = Kroger private label products
                brand = "store" if brand_raw.lower() in ("kroger", "") else "name"

                category = parse_category(prod.get("categories"))
                image_url = parse_image_url(prod.get("images"))
                kroger_price = parse_price(prod)
                keywords = parse_keywords(prod)

                # Build GroceryItem
                item = GroceryItem(
                    title=title,
                    brand=brand,
                    image_url=image_url,
                    affiliate_link=product_id,   # reuse affiliate_link as external ID
                    availability="in_stock",
                    category=category,
                    keywords=keywords,
                )
                db.session.add(item)
                db.session.flush()  # get item.id before adding related rows

                # Add prices and availability for all chains
                for chain in STORE_CHAINS:
                    if kroger_price:
                        multiplier = CHAIN_PRICE_MULTIPLIERS.get(chain, 1.0)
                        # Add small random variation (±3%) so prices aren't identical
                        jitter = random.uniform(-0.03, 0.03)
                        chain_price = round(kroger_price * multiplier * (1 + jitter), 2)
                        chain_price = max(chain_price, 0.25)  # floor at $0.25
                        db.session.add(ItemPrice(
                            item_id=item.id,
                            store_chain=chain,
                            price=chain_price,
                        ))
                    db.session.add(ItemStoreAvailability(
                        item_id=item.id,
                        store_chain=chain,
                    ))

                added += 1
                new_this_term += 1

            print(f"  +{new_this_term} new items  (total unique: {len(seen_product_ids)}, api calls so far: ~{api_calls})")

            # Commit in batches to avoid giant transactions
            if added % 200 == 0 and added > 0:
                db.session.commit()
                print(f"  [checkpoint] committed {added} items so far")

            # Stay well within 10,000 calls/day limit
            if api_calls >= 9000:
                print("Approaching daily API limit (9000 calls). Stopping early.")
                break

        db.session.commit()
        print(f"\nDone. Added {added} new items, skipped {skipped} duplicates.")
        print(f"Approximate API calls used: ~{api_calls}")


if __name__ == "__main__":
    seed()
