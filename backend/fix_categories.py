"""
Fix item categories in the DB using title-keyword rules.

Many boxed/dry goods were tagged "Canned Goods" because the Kroger API groups
shelf-stable packaged items under "Canned & Shelf Stable" categories. This script
reassigns them to the correct category based on product title patterns.

Run from backend/ directory:
    python fix_categories.py
"""

import sys
import os
import re

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from database import db
from models import GroceryItem

# Rules: (regex pattern, new_category)
# Ordered from most-specific to least-specific.
TITLE_RULES = [
    # Bakery — baked goods FIRST, before Cereal/Breakfast catches them
    (r"\b(muffins?|english muffins?|cinnamon rolls?|cinnamon buns?|sticky buns?|"
     r"danishs?|danish pastry|croissants?|donuts?|doughnuts?|scones?|coffee cake|"
     r"crescent rolls?|dinner rolls?|sweet rolls?|pull apart|"
     r"biscuits?(?! mix)|pancakes?(?!.*mix)|waffles?(?!.*mix|.*frozen)|"
     r"french toast(?!.*mix)|pastries|pastry|turnovers?|strudels?|"
     r"kolaches?|bear claw|eclairs?|cream puff|cannoli|brioche|fritter)\b",
     "Bakery"),

    # Cereal & Breakfast (actual cereals and hot cereals only)
    (r"\b(oatmeal|grits|cream of wheat|oat bran|malt.*o.*meal|quaker oat|"
     r"wheaties|cheerio|corn flake|bran flake|raisin bran|frosted mini|"
     r"froot loop|lucky charm|cap'n crunch|honey nut|"
     r"muesli|porridge|farina|breakfast cereal|hot cereal|instant oat|"
     r"granola cereal|cereal bar|morning cereal)\b",
     "Cereal"),

    # Baking mixes & supplies
    (r"\b(cake mix|brownie mix|muffin mix|cookie mix|biscuit mix|"
     r"cornbread mix|pancake mix|waffle mix|bread mix|pizza dough mix|"
     r"pudding mix|jell-?o|gelatin mix|cheesecake mix|frosting|"
     r"powdered sugar|baking mix|pie filling)\b",
     "Baking"),

    # Pasta / Rice / Dry Grains (boxed or dry)
    (r"\b(mac(aroni)?.*(and|&|n).?cheese|kraft dinner|velveeta shells|"
     r"hamburger helper|pasta roni|rice.?a.?roni|tuna helper|"
     r"instant rice|minute rice|uncle ben|ben.s original|"
     r"instant noodle|ramen|cup noodle|maruchan|"
     r"instant mashed potato|mashed potato mix|potato flakes|"
     r"idaho potato|potato buds|potato mix|au gratin potato|"
     r"scalloped potato|potato casserole|hash brown mix|"
     r"couscous mix|quinoa mix|stuffing mix|stove top stuffing|"
     r"knorr pasta|knorr rice|knorr side|pasta side|rice side)\b",
     "Pasta"),

    # Snacks — keep chips/crackers/candy out of canned goods
    (r"\b(potato chip|corn chip|tortilla chip|pita chip|veggie chip|"
     r"cheese puff|cheese curl|cheeto|dorito|lays|pringles|ruffles|"
     r"cracker|pretzel|popcorn|rice cake|rice crisp|"
     r"granola bar|protein bar|snack bar|cereal bar|fruit snack|"
     r"fruit roll|gummy|licorice|candy|chocolate bar|"
     r"trail mix|nut mix|chex mix)\b",
     "Snacks"),

    # Beverages — instant/powdered drink mixes often slip into canned goods
    (r"\b(drink mix|kool.?aid|crystal light|tang powder|"
     r"instant coffee|instant tea|hot cocoa mix|hot chocolate mix|"
     r"chai mix|cider mix|lemonade mix)\b",
     "Beverages"),

    # Condiments — dry sauce/gravy packets
    (r"\b(gravy mix|sauce mix|seasoning packet|taco seasoning|"
     r"ranch mix|dip mix|dressing mix|hollandaise mix|"
     r"bearnaise mix|soup mix packet)\b",
     "Condiments"),

    # Condiments — jars/bottles that can end up with canned goods
    (r"\b(salsa|hot sauce|bbq sauce|barbecue sauce|ketchup|mustard|"
     r"mayonnaise|mayo|relish|pickle|olive|capers|jam|jelly|"
     r"peanut butter|almond butter|nut butter|honey|maple syrup|"
     r"pancake syrup|molasses|tahini|hummus jar)\b",
     "Condiments"),

    # Canned Goods — tighten to actual canned/jarred food items only
    # "jar candle" / "candle" titles should NOT be matched here
    (r"\b(canned |in can|in brine|in water|in oil)\b|"
     r"\b(jarred|jar of|jar with)\b(?!.*candle)|"
     r"\b(tomato sauce|tomato paste|tomato puree|diced tomato|crushed tomato|"
     r"canned tomato|canned bean|canned corn|canned pea|canned peach|"
     r"canned pear|canned pineapple|canned tuna|canned salmon|canned chicken|"
     r"canned soup|chicken broth|vegetable broth|beef broth|"
     r"condensed soup|cream of mushroom|cream of chicken|chicken noodle soup)\b",
     "Canned Goods"),
]

# Compile once
COMPILED_RULES = [(re.compile(pat, re.IGNORECASE), cat) for pat, cat in TITLE_RULES]

# Categories that are correct sources to re-evaluate (wrongly assigned)
SOURCE_CATEGORIES = {"Canned Goods", "Other", "Cereal"}


def classify_by_title(title: str) -> str | None:
    """Return a corrected category if title matches a rule, else None."""
    for pattern, category in COMPILED_RULES:
        if pattern.search(title):
            return category
    return None


def fix():
    app = create_app()
    with app.app_context():
        items = GroceryItem.query.filter(
            GroceryItem.category.in_(SOURCE_CATEGORIES)
        ).all()
        print(f"Checking {len(items)} items in categories: {SOURCE_CATEGORIES}")

        changed = 0
        for item in items:
            new_cat = classify_by_title(item.title)
            if new_cat and new_cat != item.category:
                print(f"  [{item.category}] -> [{new_cat}]  {item.title}")
                item.category = new_cat
                changed += 1

        db.session.commit()
        print(f"\nDone. Updated {changed} items.")


if __name__ == "__main__":
    fix()
