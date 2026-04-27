import IButton from "@/components/custom/Button";
import { cn } from "@/lib/utils";

export default function TakeOrderCategoryTabs({
  categories = [],
  selectedCategory = "all",
  onSelectCategory,
}) {
  return (
    <ul className="mt-5 flex flex-nowrap gap-2 overflow-x-auto pb-2">
      {categories.map((tab) => {
        const isActive = selectedCategory === tab.id;
        const CategoryIcon = tab.icon;

        return (
          <li key={tab.id}>
            <IButton
              type="button"
              variant="outline"
              showLoading={false}
              className={cn(
                "h-9 rounded-full border px-4 text-sm font-semibold",
                isActive
                  ? "border-transparent bg-orange text-white shadow-sm hover:bg-orange/90"
                  : "border-gray-200 bg-white text-gray-700 hover:border-orange/40 hover:text-orange",
              )}
              onClick={() => onSelectCategory(tab.id)}
            >
              <CategoryIcon className="size-4" />
              <span>{tab.label}</span>
            </IButton>
          </li>
        );
      })}
    </ul>
  );
}
