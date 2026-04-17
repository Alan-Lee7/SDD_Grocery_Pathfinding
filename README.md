# SDD_Grocery_Pathfinding by Vibe Coders
Spring 2026 SD&D Grocery Pathfinding
Team members: Alan, Peijing, Will, Sebastian

## Running the app

### Frontend
```bash
npm i
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

## Coupon behavior (current status)

Current hard-coded/DB coupons can be fetched from:
- `GET /api/coupons`

Coupons now affect optimized pricing when `coupon_mode=true` in `/api/optimize`.\n\nApplied logic:\n- `dollar`: subtract fixed dollar amount\n- `bogo`: approximate per-unit price at 50% (and `B2G1` at 2/3 unit price)\n- `special` with `X for $Y`: effective unit price = `Y/X`\n\nThe optimizer now returns:\n- `base_total_estimate`\n- `effective_total_estimate`\n- `estimated_savings`\n\nCoupon math is applied to matched products through the `CouponAwareMatcher` path.

---

## Factory Method pattern in backend

The backend uses an explicit Factory Method structure for selecting matching/planning strategies.

### Product interfaces
- `ProductMatcher` (matching strategy)
- `AislePlanner` (aisle routing strategy)

Defined in:
- `backend/services/interfaces.py`

### Concrete products
Matchers:
- `DefaultMatcher` → `backend/services/matchers/default_matcher.py`
- `StoreBrandPreferredMatcher` → `backend/services/matchers/store_brand_matcher.py`
- `BudgetAwareMatcher` → `backend/services/matchers/budget_matcher.py`
- `CouponAwareMatcher` → `backend/services/matchers/coupon_matcher.py`

Planners:
- `DefaultAislePlanner` → `backend/services/planners/default_planner.py`
- `MobilityFriendlyAislePlanner` → `backend/services/planners/accessibility_planner.py`

### Creator interfaces and concrete creators
Matcher creators:
- `MatcherFactory` (base)
- `BasicMatcherFactory`
- `PreferenceMatcherFactory`
- `BudgetMatcherFactory`
- `AdvancedMatcherFactory`

Defined in:
- `backend/factories/matcher_factory.py`

Planner creators:
- `AislePlannerFactory` (base)
- `DefaultAislePlannerFactory`
- `AccessibilityAislePlannerFactory`

Defined in:
- `backend/factories/planner_factory.py`

### Client/orchestration
- `optimize_shopping_list(...)` in `backend/services/optimize_service.py`
  - builds `OptimizeContext`
  - asks factories to create matcher/planner
  - runs match + plan

### Route entrypoint
- `POST /api/optimize` in `backend/routes/optimize.py`
  - thin controller that delegates to `optimize_service`

---

## Notes

- Factory scaffolding is implemented and active in routing logic.
- Coupon and budget concrete matchers currently delegate to baseline behavior and can be extended with real price-adjustment logic.

