from services.interfaces import OptimizeContext
from services.matchers.default_matcher import DefaultMatcher
from services.matchers.store_brand_matcher import StoreBrandPreferredMatcher
from services.matchers.budget_matcher import BudgetAwareMatcher
from services.matchers.coupon_matcher import CouponAwareMatcher


class MatcherFactory:
    def create_matcher(self, context: OptimizeContext):
        raise NotImplementedError


class BasicMatcherFactory(MatcherFactory):
    def create_matcher(self, context: OptimizeContext):
        return DefaultMatcher()


class PreferenceMatcherFactory(MatcherFactory):
    def create_matcher(self, context: OptimizeContext):
        if context.prefer_store_brand:
            return StoreBrandPreferredMatcher()
        return DefaultMatcher()


class BudgetMatcherFactory(MatcherFactory):
    def create_matcher(self, context: OptimizeContext):
        if context.budget and context.budget > 0:
            return BudgetAwareMatcher(prefer_store_brand=context.prefer_store_brand)
        return PreferenceMatcherFactory().create_matcher(context)


class AdvancedMatcherFactory(MatcherFactory):
    def create_matcher(self, context: OptimizeContext):
        if context.coupon_mode:
            return CouponAwareMatcher(prefer_store_brand=context.prefer_store_brand)
        return BudgetMatcherFactory().create_matcher(context)
