from dataclasses import dataclass
from typing import List, Dict, Protocol


@dataclass
class OptimizeContext:
    store_chain: str
    prefer_store_brand: bool = False
    budget: float = 0.0
    coupon_mode: bool = False


class ProductMatcher(Protocol):
    def match(self, input_items: List[str], store_chain: str) -> Dict:
        ...


class AislePlanner(Protocol):
    def plan(self, matched_items: List[Dict], store_chain: str) -> List[Dict]:
        ...
