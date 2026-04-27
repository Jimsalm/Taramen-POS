import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { cn } from "@/lib/utils";

export default function TakeOrderMenuGrid({
  items = [],
  isLoading = false,
  hasError = false,
  onAddItem,
  formatCurrency,
}) {
  return (
    <div className="mt-6">
      <Title size="md" className="text-gray-900">
        Popular Items
      </Title>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() => onAddItem(item)}
            >
              <div
                className={cn(
                  "relative h-36 w-full bg-gradient-to-br",
                  item.accent,
                )}
              />
              <div className="space-y-1 p-3">
                <div>
                  <Title size="sm" className="text-gray-900">
                    {item.name}
                  </Title>
                  <Paragraph size="sm" className="text-gray-500">
                    {formatCurrency(item.price)}
                  </Paragraph>
                </div>
              </div>
            </button>
          </li>
        ))}
        {!isLoading && !hasError && items.length === 0 ? (
          <li className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            No available menu items match this filter.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
