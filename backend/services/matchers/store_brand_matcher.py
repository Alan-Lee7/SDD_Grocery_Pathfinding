from typing import List, Dict
from services.matchers.common import items_available_at_store, match_candidates, to_product_payload, get_store_price


class StoreBrandPreferredMatcher:
    def match(self, input_items: List[str], store_chain: str) -> Dict:
        items_at_store = items_available_at_store(store_chain)
        matched = []
        unmatched = []

        for raw_input in input_items:
            candidates = match_candidates(raw_input, items_at_store)
            selected = None
            if candidates:
                store_brand = next((i for i in candidates if i.brand == "store"), None)
                selected = store_brand if store_brand else min(candidates, key=lambda i: get_store_price(i, store_chain))

            if selected:
                matched.append({
                    "raw_input": raw_input,
                    "product": to_product_payload(selected),
                })
            else:
                unmatched.append(raw_input)

        return {"matched_items": matched, "unmatched_items": unmatched}
