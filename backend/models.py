from datetime import datetime
from database import db


class User(db.Model):
    """User class - handles authentication and user profile."""
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    zip_code = db.Column(db.String(10))
    prefer_store_brand = db.Column(db.Boolean, default=False)
    large_text = db.Column(db.Boolean, default=False)
    budget = db.Column(db.Float, default=0.0)

    carts = db.relationship("ShoppingCart", backref="user", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "zip_code": self.zip_code,
            "prefer_store_brand": self.prefer_store_brand,
            "large_text": self.large_text,
            "budget": self.budget,
        }


class Store(db.Model):
    """Store class - represents a physical grocery store location."""
    __tablename__ = "store"

    id = db.Column(db.Integer, primary_key=True)
    chain = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    state = db.Column(db.String(2))
    zip = db.Column(db.String(10))
    distance = db.Column(db.Float, default=0.0)

    coupons = db.relationship("Coupon", backref="store_rel", lazy=True, cascade="all, delete-orphan")
    carts = db.relationship("ShoppingCart", backref="store", lazy=True)

    def to_dict(self):
        return {
            "store_id": self.id,
            "chain": self.chain,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "distance": self.distance,
        }


class GroceryItem(db.Model):
    """Grocery Item class - subclass of store, represents a product sold in stores."""
    __tablename__ = "grocery_item"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(20), default="store")  # 'store' or 'name'
    image_url = db.Column(db.String(500))
    affiliate_link = db.Column(db.String(500))
    availability = db.Column(db.String(20), default="in_stock")
    category = db.Column(db.String(50))
    keywords = db.Column(db.Text)  # stored as JSON string

    prices = db.relationship("ItemPrice", backref="item", lazy=True, cascade="all, delete-orphan")
    store_availability = db.relationship("ItemStoreAvailability", backref="item", lazy=True, cascade="all, delete-orphan")
    cart_items = db.relationship("CartItem", backref="item", lazy=True)

    def to_dict(self, store_chain=None):
        import json
        all_prices = {p.store_chain: p.price for p in self.prices}
        all_stores = [s.store_chain for s in self.store_availability]
        keywords_list = json.loads(self.keywords) if self.keywords else []

        result = {
            "product_id": self.id,
            "title": self.title,
            "brand": self.brand,
            "image_url": self.image_url,
            "affiliate_link": self.affiliate_link,
            "availability": self.availability,
            "category": self.category,
            "keywords": keywords_list,
            "prices": all_prices,
            "stores": all_stores,
        }
        return result


class ItemPrice(db.Model):
    """Stores price of a GroceryItem at a specific store chain."""
    __tablename__ = "item_price"

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("grocery_item.id"), nullable=False)
    store_chain = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)


class ItemStoreAvailability(db.Model):
    """Tracks which store chains carry a given GroceryItem."""
    __tablename__ = "item_store_availability"

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("grocery_item.id"), nullable=False)
    store_chain = db.Column(db.String(50), nullable=False)


class StoreLayout(db.Model):
    """Maps product categories to aisles in each store chain."""
    __tablename__ = "store_layout"

    id = db.Column(db.Integer, primary_key=True)
    chain = db.Column(db.String(50), nullable=False)
    aisle = db.Column(db.String(20))
    aisle_name = db.Column(db.String(100))
    zone_order = db.Column(db.Integer)
    category = db.Column(db.String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "chain": self.chain,
            "aisle": self.aisle,
            "aisle_name": self.aisle_name,
            "zone_order": self.zone_order,
            "category": self.category,
        }


class Coupon(db.Model):
    """Coupon class - store-specific deals and discounts."""
    __tablename__ = "coupon"

    id = db.Column(db.Integer, primary_key=True)
    coupon_code = db.Column(db.String(50), unique=True)
    store_id = db.Column(db.Integer, db.ForeignKey("store.id"), nullable=False)
    store_chain = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    discount = db.Column(db.String(50))
    category = db.Column(db.String(50))
    expires_in = db.Column(db.String(50))
    coupon_type = db.Column(db.String(20))  # percentage, dollar, bogo, special

    def to_dict(self):
        return {
            "id": self.coupon_code or str(self.id),
            "store": self.store_chain,
            "title": self.title,
            "description": self.description,
            "discount": self.discount,
            "category": self.category,
            "expiresIn": self.expires_in,
            "code": self.coupon_code,
            "type": self.coupon_type,
        }


class ShoppingCart(db.Model):
    """Shopping Cart class - persists user cart state per store."""
    __tablename__ = "shopping_cart"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey("store.id"), nullable=True)
    store_chain = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cart_items = db.relationship("CartItem", backref="cart", lazy=True, cascade="all, delete-orphan")

    def total_cost(self):
        total = 0.0
        for ci in self.cart_items:
            price = ItemPrice.query.filter_by(
                item_id=ci.item_id, store_chain=self.store_chain
            ).first()
            if price:
                total += price.price * ci.quantity
        return round(total, 2)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "store_id": self.store_id,
            "store_chain": self.store_chain,
            "total_cost": self.total_cost(),
            "items": [ci.to_dict() for ci in self.cart_items],
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class CartItem(db.Model):
    """Represents a single item + quantity inside a ShoppingCart."""
    __tablename__ = "cart_item"

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("shopping_cart.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("grocery_item.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "quantity": self.quantity,
        }
