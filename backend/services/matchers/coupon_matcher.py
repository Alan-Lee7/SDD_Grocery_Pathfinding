from typing import List, Dict
from services.matchers.store_brand_matcher import StoreBrandPreferredMatcher
from services.matchers.default_matcher import DefaultMatcher


class CouponAwareMatcher:
    def __init__(self, prefer_store_brand: bool = False):
        self._delegate = StoreBrandPreferredMatcher(coupon_mode=True) if prefer_store_brand else DefaultMatcher(coupon_mode=True)

    def match(self, input_items: List[str], store_chain: str) -> Dict:
        return self._delegate.match(input_items, store_chain)
