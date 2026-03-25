"""
Seed script: populates Store and StoreLayout tables with real grocery stores
near ZIP code 12180 (Troy, NY).

Run from the backend/ directory:
    python seed_stores.py
"""

import sys
import os
import math

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from database import db
from models import Store, StoreLayout

# ---------------------------------------------------------------------------
# Haversine helper — computes miles between two lat/lon points
# ---------------------------------------------------------------------------
def haversine(lat1, lon1, lat2, lon2):
    R = 3958.8
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# Center of ZIP 12180 (Troy, NY)
TROY_LAT, TROY_LON = 42.7284, -73.6918

# ---------------------------------------------------------------------------
# Store data — real grocery stores in/near Troy, NY 12180
# Coordinates are approximate street-level positions
# ---------------------------------------------------------------------------
STORES = [
    # --- Price Chopper ---
    {
        "chain": "Price Chopper",
        "name": "Price Chopper - Troy 3rd Ave",
        "address": "600 3rd Ave",
        "city": "Troy",
        "state": "NY",
        "zip": "12180",
        "latitude": 42.7276,
        "longitude": -73.6925,
    },
    {
        "chain": "Price Chopper",
        "name": "Price Chopper - Latham",
        "address": "579 Troy-Schenectady Rd",
        "city": "Latham",
        "state": "NY",
        "zip": "12110",
        "latitude": 42.7394,
        "longitude": -73.7752,
    },
    {
        "chain": "Price Chopper",
        "name": "Price Chopper - Cohoes",
        "address": "141 Saratoga Rd",
        "city": "Cohoes",
        "state": "NY",
        "zip": "12047",
        "latitude": 42.7768,
        "longitude": -73.7022,
    },
    # --- Hannaford ---
    {
        "chain": "Hannaford",
        "name": "Hannaford - Troy Hoosick St",
        "address": "403 Hoosick St",
        "city": "Troy",
        "state": "NY",
        "zip": "12180",
        "latitude": 42.7354,
        "longitude": -73.6681,
    },
    {
        "chain": "Hannaford",
        "name": "Hannaford - Watervliet",
        "address": "1510 Broadway",
        "city": "Watervliet",
        "state": "NY",
        "zip": "12189",
        "latitude": 42.7268,
        "longitude": -73.7085,
    },
    {
        "chain": "Hannaford",
        "name": "Hannaford - East Greenbush",
        "address": "869 Columbia Turnpike",
        "city": "East Greenbush",
        "state": "NY",
        "zip": "12061",
        "latitude": 42.5988,
        "longitude": -73.7258,
    },
    # --- Walmart ---
    {
        "chain": "Walmart",
        "name": "Walmart Supercenter - Latham",
        "address": "790 New Loudon Rd",
        "city": "Latham",
        "state": "NY",
        "zip": "12110",
        "latitude": 42.7617,
        "longitude": -73.7752,
    },
    {
        "chain": "Walmart",
        "name": "Walmart Supercenter - Rensselaer",
        "address": "382 Columbia Turnpike",
        "city": "Rensselaer",
        "state": "NY",
        "zip": "12144",
        "latitude": 42.6518,
        "longitude": -73.7362,
    },
    # --- Aldi ---
    {
        "chain": "Aldi",
        "name": "Aldi - Latham",
        "address": "800 New Loudon Rd",
        "city": "Latham",
        "state": "NY",
        "zip": "12110",
        "latitude": 42.7620,
        "longitude": -73.7719,
    },
    {
        "chain": "Aldi",
        "name": "Aldi - Colonie",
        "address": "1425 Central Ave",
        "city": "Colonie",
        "state": "NY",
        "zip": "12205",
        "latitude": 42.7210,
        "longitude": -73.8060,
    },
]

# Compute distance from Troy 12180 for each store
for s in STORES:
    s["distance"] = round(haversine(TROY_LAT, TROY_LON, s["latitude"], s["longitude"]), 1)

# ---------------------------------------------------------------------------
# Store layout data — aisle mapping per chain
# ---------------------------------------------------------------------------
LAYOUTS = {
    "Price Chopper": [
        {"aisle": "1",  "aisle_name": "Produce",               "zone_order": 1,  "category": "Produce"},
        {"aisle": "2",  "aisle_name": "Bakery & Bread",         "zone_order": 2,  "category": "Bakery"},
        {"aisle": "3",  "aisle_name": "Deli & Prepared Foods",  "zone_order": 3,  "category": "Deli"},
        {"aisle": "4",  "aisle_name": "Meat & Seafood",         "zone_order": 4,  "category": "Meat"},
        {"aisle": "5",  "aisle_name": "Dairy & Eggs",           "zone_order": 5,  "category": "Dairy"},
        {"aisle": "6",  "aisle_name": "Frozen Foods",           "zone_order": 6,  "category": "Frozen"},
        {"aisle": "7",  "aisle_name": "Beverages",              "zone_order": 7,  "category": "Beverages"},
        {"aisle": "8",  "aisle_name": "Snacks & Candy",         "zone_order": 8,  "category": "Snacks"},
        {"aisle": "9",  "aisle_name": "Cereal & Breakfast",     "zone_order": 9,  "category": "Cereal"},
        {"aisle": "10", "aisle_name": "Canned & Packaged Goods","zone_order": 10, "category": "Canned Goods"},
        {"aisle": "11", "aisle_name": "Pasta, Rice & Grains",   "zone_order": 11, "category": "Pasta"},
        {"aisle": "12", "aisle_name": "Condiments & Sauces",    "zone_order": 12, "category": "Condiments"},
        {"aisle": "13", "aisle_name": "Baking Supplies",        "zone_order": 13, "category": "Baking"},
        {"aisle": "14", "aisle_name": "Personal Care",          "zone_order": 14, "category": "Personal Care"},
        {"aisle": "15", "aisle_name": "Cleaning & Household",   "zone_order": 15, "category": "Cleaning"},
        {"aisle": "16", "aisle_name": "Baby & Kids",            "zone_order": 16, "category": "Baby"},
        {"aisle": "17", "aisle_name": "Pet Supplies",           "zone_order": 17, "category": "Pet"},
        {"aisle": "18", "aisle_name": "Health & Pharmacy",      "zone_order": 18, "category": "Health"},
    ],
    "Hannaford": [
        {"aisle": "1",  "aisle_name": "Produce",                "zone_order": 1,  "category": "Produce"},
        {"aisle": "2",  "aisle_name": "Floral & Organic",       "zone_order": 2,  "category": "Organic"},
        {"aisle": "3",  "aisle_name": "Bakery",                 "zone_order": 3,  "category": "Bakery"},
        {"aisle": "4",  "aisle_name": "Meat & Poultry",         "zone_order": 4,  "category": "Meat"},
        {"aisle": "5",  "aisle_name": "Seafood",                "zone_order": 5,  "category": "Seafood"},
        {"aisle": "6",  "aisle_name": "Deli",                   "zone_order": 6,  "category": "Deli"},
        {"aisle": "7",  "aisle_name": "Dairy & Eggs",           "zone_order": 7,  "category": "Dairy"},
        {"aisle": "8",  "aisle_name": "Frozen Foods",           "zone_order": 8,  "category": "Frozen"},
        {"aisle": "9",  "aisle_name": "Beverages & Water",      "zone_order": 9,  "category": "Beverages"},
        {"aisle": "10", "aisle_name": "Snacks",                 "zone_order": 10, "category": "Snacks"},
        {"aisle": "11", "aisle_name": "Breakfast & Cereal",     "zone_order": 11, "category": "Cereal"},
        {"aisle": "12", "aisle_name": "Canned Goods",           "zone_order": 12, "category": "Canned Goods"},
        {"aisle": "13", "aisle_name": "Pasta & Grains",         "zone_order": 13, "category": "Pasta"},
        {"aisle": "14", "aisle_name": "Condiments & Spices",    "zone_order": 14, "category": "Condiments"},
        {"aisle": "15", "aisle_name": "Baking",                 "zone_order": 15, "category": "Baking"},
        {"aisle": "16", "aisle_name": "Natural & Specialty",    "zone_order": 16, "category": "Natural"},
        {"aisle": "17", "aisle_name": "Personal Care & Beauty", "zone_order": 17, "category": "Personal Care"},
        {"aisle": "18", "aisle_name": "Cleaning Supplies",      "zone_order": 18, "category": "Cleaning"},
        {"aisle": "19", "aisle_name": "Pet Care",               "zone_order": 19, "category": "Pet"},
        {"aisle": "20", "aisle_name": "Health & Wellness",      "zone_order": 20, "category": "Health"},
    ],
    "Walmart": [
        {"aisle": "A1", "aisle_name": "Fresh Produce",          "zone_order": 1,  "category": "Produce"},
        {"aisle": "A2", "aisle_name": "Bakery",                 "zone_order": 2,  "category": "Bakery"},
        {"aisle": "A3", "aisle_name": "Deli & Prepared",        "zone_order": 3,  "category": "Deli"},
        {"aisle": "A4", "aisle_name": "Meat & Poultry",         "zone_order": 4,  "category": "Meat"},
        {"aisle": "A5", "aisle_name": "Seafood",                "zone_order": 5,  "category": "Seafood"},
        {"aisle": "A6", "aisle_name": "Dairy & Eggs",           "zone_order": 6,  "category": "Dairy"},
        {"aisle": "B1", "aisle_name": "Frozen Foods",           "zone_order": 7,  "category": "Frozen"},
        {"aisle": "B2", "aisle_name": "Beverages",              "zone_order": 8,  "category": "Beverages"},
        {"aisle": "B3", "aisle_name": "Snacks & Candy",         "zone_order": 9,  "category": "Snacks"},
        {"aisle": "B4", "aisle_name": "Cereal & Breakfast",     "zone_order": 10, "category": "Cereal"},
        {"aisle": "B5", "aisle_name": "Canned & Jarred Goods",  "zone_order": 11, "category": "Canned Goods"},
        {"aisle": "B6", "aisle_name": "Pasta, Rice & Grains",   "zone_order": 12, "category": "Pasta"},
        {"aisle": "B7", "aisle_name": "Condiments & Cooking",   "zone_order": 13, "category": "Condiments"},
        {"aisle": "B8", "aisle_name": "Baking Supplies",        "zone_order": 14, "category": "Baking"},
        {"aisle": "C1", "aisle_name": "Personal Care",          "zone_order": 15, "category": "Personal Care"},
        {"aisle": "C2", "aisle_name": "Cleaning Products",      "zone_order": 16, "category": "Cleaning"},
        {"aisle": "C3", "aisle_name": "Baby Products",          "zone_order": 17, "category": "Baby"},
        {"aisle": "C4", "aisle_name": "Pet Supplies",           "zone_order": 18, "category": "Pet"},
        {"aisle": "C5", "aisle_name": "Health & OTC Medicine",  "zone_order": 19, "category": "Health"},
    ],
    "Aldi": [
        {"aisle": "1",  "aisle_name": "Fresh Produce",          "zone_order": 1,  "category": "Produce"},
        {"aisle": "2",  "aisle_name": "Meat & Dairy",           "zone_order": 2,  "category": "Meat"},
        {"aisle": "2",  "aisle_name": "Meat & Dairy",           "zone_order": 3,  "category": "Dairy"},
        {"aisle": "3",  "aisle_name": "Bread & Bakery",         "zone_order": 4,  "category": "Bakery"},
        {"aisle": "4",  "aisle_name": "Frozen Foods",           "zone_order": 5,  "category": "Frozen"},
        {"aisle": "5",  "aisle_name": "Beverages",              "zone_order": 6,  "category": "Beverages"},
        {"aisle": "6",  "aisle_name": "Snacks",                 "zone_order": 7,  "category": "Snacks"},
        {"aisle": "7",  "aisle_name": "Breakfast & Cereal",     "zone_order": 8,  "category": "Cereal"},
        {"aisle": "8",  "aisle_name": "Canned & Packaged",      "zone_order": 9,  "category": "Canned Goods"},
        {"aisle": "9",  "aisle_name": "Pasta & Grains",         "zone_order": 10, "category": "Pasta"},
        {"aisle": "10", "aisle_name": "Condiments & Sauces",    "zone_order": 11, "category": "Condiments"},
        {"aisle": "11", "aisle_name": "Baking",                 "zone_order": 12, "category": "Baking"},
        {"aisle": "12", "aisle_name": "Health & Personal Care", "zone_order": 13, "category": "Personal Care"},
        {"aisle": "12", "aisle_name": "Health & Personal Care", "zone_order": 14, "category": "Health"},
        {"aisle": "13", "aisle_name": "Household & Cleaning",   "zone_order": 15, "category": "Cleaning"},
    ],
}


def migrate_schema(engine):
    """Add latitude/longitude columns if they don't already exist (SQLite-safe).
    Uses a raw DBAPI connection so SQLAlchemy's ORM layer isn't involved."""
    raw = engine.raw_connection()
    try:
        cur = raw.cursor()
        for col in ("latitude", "longitude"):
            try:
                cur.execute(f"ALTER TABLE store ADD COLUMN {col} FLOAT")
                print(f"  MIGRATED: added column store.{col}")
            except Exception:
                pass  # column already exists
        raw.commit()
    finally:
        raw.close()


def seed():
    app = create_app()
    with app.app_context():
        # Migrate schema BEFORE the ORM queries the table
        migrate_schema(db.engine)

        # ---- Stores ----
        existing = {(s.chain, s.address) for s in Store.query.all()}
        added_stores = 0
        for s in STORES:
            key = (s["chain"], s["address"])
            if key in existing:
                # Update lat/lon/distance on existing rows
                row = Store.query.filter_by(chain=s["chain"], address=s["address"]).first()
                row.latitude = s["latitude"]
                row.longitude = s["longitude"]
                row.distance = s["distance"]
                print(f"  UPDATE: {s['name']} ({s['distance']} mi)")
            else:
                db.session.add(Store(**s))
                added_stores += 1
                print(f"  ADD store: {s['name']} ({s['distance']} mi)")

        # ---- Store Layouts ----
        existing_layouts = {(l.chain, l.category) for l in StoreLayout.query.all()}
        added_layouts = 0
        for chain, aisles in LAYOUTS.items():
            for aisle in aisles:
                if (chain, aisle["category"]) not in existing_layouts:
                    db.session.add(StoreLayout(chain=chain, **aisle))
                    added_layouts += 1

        db.session.commit()
        print(f"\nDone. Added {added_stores} new store(s), updated existing, added {added_layouts} layout row(s).")


if __name__ == "__main__":
    seed()
