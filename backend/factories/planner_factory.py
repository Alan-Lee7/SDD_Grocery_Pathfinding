from services.interfaces import OptimizeContext
from services.planners.default_planner import DefaultAislePlanner
from services.planners.accessibility_planner import MobilityFriendlyAislePlanner


class AislePlannerFactory:
    def create_planner(self, context: OptimizeContext):
        raise NotImplementedError


class DefaultAislePlannerFactory(AislePlannerFactory):
    def create_planner(self, context: OptimizeContext):
        return DefaultAislePlanner()


class AccessibilityAislePlannerFactory(AislePlannerFactory):
    def create_planner(self, context: OptimizeContext):
        return MobilityFriendlyAislePlanner()
