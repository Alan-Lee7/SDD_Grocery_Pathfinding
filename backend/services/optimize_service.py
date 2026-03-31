from services.interfaces import OptimizeContext
from factories.matcher_factory import AdvancedMatcherFactory
from factories.planner_factory import DefaultAislePlannerFactory, AccessibilityAislePlannerFactory


def optimize_shopping_list(input_items, store_chain, prefer_store_brand=False, budget=0.0, coupon_mode=False, accessibility_mode=False):
    context = OptimizeContext(
        store_chain=store_chain,
        prefer_store_brand=bool(prefer_store_brand),
        budget=float(budget or 0.0),
        coupon_mode=bool(coupon_mode),
    )

    matcher = AdvancedMatcherFactory().create_matcher(context)
    planner_factory = AccessibilityAislePlannerFactory() if accessibility_mode else DefaultAislePlannerFactory()
    planner = planner_factory.create_planner(context)

    match_result = matcher.match(input_items, context.store_chain)
    optimized_list = planner.plan(match_result["matched_items"], context.store_chain)

    base_total = 0.0
    effective_total = 0.0
    for m in match_result["matched_items"]:
        p = m.get("product", {})
        base_total += float(p.get("base_unit_price", 0.0) or 0.0)
        effective_total += float(p.get("effective_unit_price", p.get("base_unit_price", 0.0)) or 0.0)

    return {
        "optimized_list": optimized_list,
        "unmatched_items": match_result["unmatched_items"],
        "base_total_estimate": round(base_total, 2),
        "effective_total_estimate": round(effective_total, 2),
        "estimated_savings": round(base_total - effective_total, 2),
    }
