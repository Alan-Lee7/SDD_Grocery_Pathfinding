from typing import List, Dict
from models import StoreLayout


class DefaultAislePlanner:
    def plan(self, matched_items: List[Dict], store_chain: str) -> List[Dict]:
        layouts = StoreLayout.query.filter_by(chain=store_chain).all()
        if not layouts:
            layouts = StoreLayout.query.filter_by(chain="Walmart").all()

        aisle_groups: Dict[str, List[Dict]] = {}
        for item in matched_items:
            category = item["product"]["category"]
            aisle = next((l for l in layouts if l.category == category), None)
            if not aisle:
                continue
            key = f"{aisle.zone_order}-{aisle.aisle}"
            aisle_groups.setdefault(key, []).append(item)

        optimized_list = []
        for key in sorted(aisle_groups.keys(), key=lambda k: int(k.split("-")[0])):
            parts = key.split("-")
            aisle_code = "-".join(parts[1:])
            aisle = next((l for l in layouts if l.aisle == aisle_code), None)
            if not aisle:
                continue
            optimized_list.append({
                "zone_order": aisle.zone_order,
                "aisle": aisle.aisle,
                "aisle_name": aisle.aisle_name,
                "items": aisle_groups[key],
            })

        return optimized_list
