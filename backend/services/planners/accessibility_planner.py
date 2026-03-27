from typing import List, Dict
from services.planners.default_planner import DefaultAislePlanner


class MobilityFriendlyAislePlanner:
    def __init__(self):
        self._delegate = DefaultAislePlanner()

    def plan(self, matched_items: List[Dict], store_chain: str) -> List[Dict]:
        return self._delegate.plan(matched_items, store_chain)
