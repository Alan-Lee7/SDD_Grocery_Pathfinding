"""
One-off script: removes the word 'Kroger' (any case) from all GroceryItem titles.

Run from the backend/ directory:
    python fix_kroger_titles.py
"""

import sys
import os
import re

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from database import db
from models import GroceryItem


def clean_title(title: str) -> str:
    # Remove 'Kroger' with optional trailing/leading spaces, collapse extra spaces
    cleaned = re.sub(r'\bKroger\b', '', title, flags=re.IGNORECASE)
    return re.sub(r'\s{2,}', ' ', cleaned).strip().strip('-').strip()


def run():
    app = create_app()
    with app.app_context():
        items = GroceryItem.query.filter(
            GroceryItem.title.ilike('%kroger%')
        ).all()

        if not items:
            print("No items found containing 'Kroger'.")
            return

        print(f"Found {len(items)} items to clean:\n")
        for item in items:
            old = item.title
            item.title = clean_title(old)
            print(f"  [{item.id}] {old!r}  →  {item.title!r}")

        db.session.commit()
        print(f"\nDone. Updated {len(items)} item titles.")


if __name__ == "__main__":
    run()
