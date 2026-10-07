"""
Grocery Generation Engine for HealthFeast.
Extracts ingredients from the 7-day personalized meal plan,
aggregates quantities, eliminates redundancies, and organizes items into intuitive categories.
"""

from typing import List, Dict, Any


CATEGORY_MAP = {
    "grains": "Grains & Millets",
    "breakfast": "Grains & Breakfast",
    "dal_protein": "Pulses, Legumes & Protein",
    "vegetables": "Vegetables & Greens",
    "fruits": "Fresh Fruits",
    "dairy": "Dairy & Alternatives",
    "snacks": "Nuts, Seeds & Snacks",
    "beverages": "Beverages & Hydration",
    "other": "Pantry & Spices"
}


def generate_grocery_list_from_plan(weekly_plan: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Parses a 7-day plan, combines quantities, and produces a categorized shopping list.
    """
    items_by_name: Dict[str, Dict[str, Any]] = {}

    for day in weekly_plan:
        for meal in day.get("meals", []):
            food = meal.get("food", {})
            name = food.get("name")
            if not name:
                continue

            portion_mult = float(meal.get("portion_multiplier", 1.0))
            category_key = food.get("category", "other").lower()
            category_label = CATEGORY_MAP.get(category_key, "Other / Pantry Essentials")
            est_cost = float(food.get("estimated_cost_inr", 30)) * portion_mult

            if name in items_by_name:
                items_by_name[name]["count"] += 1
                items_by_name[name]["total_servings"] += portion_mult
                items_by_name[name]["total_cost_est"] += est_cost
            else:
                items_by_name[name] = {
                    "id": f"grocery-{len(items_by_name) + 1}",
                    "name": name,
                    "category": category_label,
                    "category_key": category_key,
                    "serving_desc": food.get("serving_size_desc", "1 serving"),
                    "count": 1,
                    "total_servings": portion_mult,
                    "total_cost_est": round(est_cost),
                    "checked": False
                }

    # Group into organized categories
    categorized: Dict[str, List[Dict[str, Any]]] = {}
    for item in items_by_name.values():
        cat = item["category"]
        if cat not in categorized:
            categorized[cat] = []
        # Format human-friendly quantity string
        item["quantity_display"] = (
            f"{round(item['total_servings'], 1)}x {item['serving_desc']}"
            if item["total_servings"] != 1
            else item["serving_desc"]
        )
        categorized[cat].append(item)

    total_est_cost = sum(item["total_cost_est"] for item in items_by_name.values())

    return {
        "total_items": len(items_by_name),
        "estimated_weekly_cost_inr": round(total_est_cost),
        "categorized_items": categorized,
        "all_items": list(items_by_name.values())
    }
