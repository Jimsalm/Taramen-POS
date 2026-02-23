import { ArrowLeft, CakeSlice, CupSoda, Flame, LayoutGrid, Search, Soup } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import IButton from "@/components/custom/Button";
import OrderCustomizeModal from "@/components/custom/OrderCustomizeModal";
import OrderSidebar from "@/components/custom/OrderSidebar";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { Badge } from "@/components/ui/badge";
import {
  extractErrorMessage,
  useAvailableMenuItems,
  useCategories,
  useCreateOrder,
  useDiscounts,
} from "@/hooks/usePosApi";
import { cn } from "@/lib/utils";

const CATEGORY_ICON_OPTIONS = [Flame, Soup, CupSoda, CakeSlice];
const ITEM_ACCENTS = [
  "from-slate-800 via-slate-700 to-slate-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-green-400 via-emerald-500 to-lime-500",
  "from-emerald-700 via-teal-700 to-cyan-700",
  "from-amber-300 via-orange-300 to-yellow-200",
  "from-stone-600 via-stone-700 to-stone-800",
  "from-orange-300 via-amber-400 to-yellow-300",
  "from-amber-400 via-yellow-400 to-orange-300",
];

const SERVER_OPTIONS = [
  { value: "john", label: "John Doe" },
  { value: "maria", label: "Maria Cruz" },
  { value: "kevin", label: "Kevin Lee" },
];

const ADD_ONS = [
  { id: "extra-cheese", label: "Extra Cheese", price: 1.5 },
  { id: "bacon", label: "Add Bacon", price: 2 },
  { id: "spicy", label: "Make it Spicy", price: 0.5 },
];

const REMOVALS = [
  { id: "no-onion", label: "No Onion" },
  { id: "less-ice", label: "Less Ice" },
  { id: "no-salt", label: "No Salt" },
];

const normalizeCategory = (category, index) => ({
  id: category?.id ?? category?.category_id ?? category?.uuid ?? String(index + 1),
  name:
    category?.name ??
    category?.category_name ??
    category?.title ??
    `Category ${index + 1}`,
});

const normalizeMenuItem = (item, index) => ({
  id: item?.id ?? item?.menu_item_id ?? item?.uuid ?? String(index + 1),
  name: item?.name ?? item?.item_name ?? item?.title ?? `Item ${index + 1}`,
  price: Number(item?.price ?? item?.selling_price ?? item?.amount ?? 0),
  details: item?.description ?? item?.details ?? "No details provided",
  categoryId:
    item?.menu_id ??
    item?.category_id ??
    item?.menu?.id ??
    item?.category?.id ??
    "",
  isAvailable: Boolean(item?.is_available ?? item?.available ?? item?.is_active ?? true),
  accent: ITEM_ACCENTS[index % ITEM_ACCENTS.length],
});

const normalizeDiscount = (discount, index) => ({
  id: discount?.id ?? discount?.discount_id ?? discount?.uuid ?? String(index + 1),
  name: discount?.name ?? discount?.title ?? `Discount ${index + 1}`,
  type: String(discount?.type ?? "").toLowerCase(),
  value: Number(discount?.value ?? discount?.amount ?? discount?.rate ?? 0),
  active: Boolean(discount?.active ?? discount?.is_active ?? true),
  category: String(
    discount?.category ?? discount?.discount_category ?? discount?.scope ?? "",
  ).toLowerCase(),
});

const NONE_DISCOUNT_OPTION = {
  value: "none",
  label: "None",
  type: "none",
  amountValue: 0,
  name: "None",
  category: "",
};

const getDiscountLabel = (discount) => {
  const value = Number(discount.value) || 0;

  if (discount.type.includes("percent")) {
    const percentValue = value > 1 ? value : value * 100;
    return `${discount.name} (${percentValue}%)`;
  }

  return `${discount.name} (-$${value.toFixed(2)})`;
};

const toDiscountOption = (discount) => ({
  value: String(discount.id),
  label: getDiscountLabel(discount),
  type: discount.type,
  amountValue: discount.value,
  name: discount.name,
  category: discount.category,
});

const calculateDiscountAmount = (subtotal, option) => {
  if (!option || option.value === "none") return 0;

  const numericValue = Number(option.amountValue) || 0;

  if (option.type.includes("percent")) {
    const rate = numericValue > 1 ? numericValue / 100 : numericValue;
    return subtotal * rate;
  }

  return numericValue;
};

const toNumberIfPossible = (value) => {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
};

export default function TakeOrder() {
  const navigate = useNavigate();
  const categoriesQuery = useCategories();
  const menuItemsQuery = useAvailableMenuItems();
  const discountsQuery = useDiscounts();
  const createOrder = useCreateOrder();

  const [tableNo, setTableNo] = useState("14");
  const [serverValue, setServerValue] = useState("john");
  const [discountValue, setDiscountValue] = useState("none");
  const [promoDiscountValue, setPromoDiscountValue] = useState("none");
  const [dineType, setDineType] = useState("dine-in");
  const [orderItems, setOrderItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizeItem, setCustomizeItem] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [customAddons, setCustomAddons] = useState([]);
  const [customRemovals, setCustomRemovals] = useState([]);
  const [newAddonLabel, setNewAddonLabel] = useState("");
  const [newAddonPrice, setNewAddonPrice] = useState("");
  const [newRemovalLabel, setNewRemovalLabel] = useState("");

  const categories = useMemo(
    () =>
      (categoriesQuery.data ?? []).map((category, index) =>
        normalizeCategory(category, index),
      ),
    [categoriesQuery.data],
  );

  const categoryTabs = useMemo(
    () => [
      { id: "all", label: "All", icon: LayoutGrid },
      ...categories.map((category, index) => ({
        id: String(category.id),
        label: category.name,
        icon: CATEGORY_ICON_OPTIONS[index % CATEGORY_ICON_OPTIONS.length] ?? LayoutGrid,
      })),
    ],
    [categories],
  );

  const menuItems = useMemo(
    () =>
      (menuItemsQuery.data ?? []).map((item, index) =>
        normalizeMenuItem(item, index),
      ),
    [menuItemsQuery.data],
  );

  const discountOptions = useMemo(
    () =>
      (discountsQuery.data ?? [])
        .map((discount, index) => normalizeDiscount(discount, index))
        .filter((discount) => discount.active)
        .map(toDiscountOption),
    [discountsQuery.data],
  );

  const regulatoryDiscountOptions = useMemo(() => {
    const regulatory = discountOptions.filter(
      (option) => !option.category.includes("promo"),
    );
    const options = regulatory.length > 0 ? regulatory : discountOptions;
    return [NONE_DISCOUNT_OPTION, ...options];
  }, [discountOptions]);

  const promoDiscountOptions = useMemo(() => {
    const promos = discountOptions.filter((option) =>
      option.category.includes("promo"),
    );
    const options = promos.length > 0 ? promos : discountOptions;
    return [NONE_DISCOUNT_OPTION, ...options];
  }, [discountOptions]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);

  const totals = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => {
      const addonTotal =
        item.addons?.reduce((addonSum, addon) => addonSum + addon.price, 0) ??
        0;
      return sum + (item.price + addonTotal) * item.qty;
    }, 0);
    const selectedDiscount =
      regulatoryDiscountOptions.find((option) => option.value === discountValue) ??
      NONE_DISCOUNT_OPTION;
    const selectedPromo =
      promoDiscountOptions.find((option) => option.value === promoDiscountValue) ??
      NONE_DISCOUNT_OPTION;

    const discountAmount = calculateDiscountAmount(subtotal, selectedDiscount);
    const promoAmount = calculateDiscountAmount(subtotal, selectedPromo);
    const taxable = Math.max(subtotal - discountAmount - promoAmount, 0);
    const taxAmount = taxable * 0.1;
    const total = taxable + taxAmount;
    return { subtotal, discountAmount, promoAmount, taxAmount, total };
  }, [
    orderItems,
    discountValue,
    promoDiscountValue,
    regulatoryDiscountOptions,
    promoDiscountOptions,
  ]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        String(item.categoryId) === String(selectedCategory);
      if (!matchesCategory) return false;
      if (!item.isAvailable) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.details.toLowerCase().includes(term)
      );
    });
  }, [menuItems, selectedCategory, searchTerm]);

  const handleAddItem = (menuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menuItem.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name,
          details: menuItem.details,
          price: menuItem.price,
          qty: 1,
          accent: menuItem.accent,
          addons: [],
          removals: [],
          note: "",
        },
      ];
    });
  };

  const handleQtyChange = (id, delta) => {
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextQty = item.qty + delta;
        return { ...item, qty: nextQty };
      }).filter((item) => item.qty > 0),
    );
  };

  const handleCustomizeItem = (item) => {
    setCustomizeItem(item);
    setSelectedAddons(item.addons?.map((addon) => addon.id) ?? []);
    setSelectedRemovals(item.removals?.map((removal) => removal.id) ?? []);
    setNoteText(item.note ?? "");
    setCustomizeOpen(true);
  };

  const toggleAddon = (addonId, checked) => {
    const isChecked = Boolean(checked);
    setSelectedAddons((prev) => {
      if (isChecked) return Array.from(new Set([...prev, addonId]));
      return prev.filter((id) => id !== addonId);
    });
  };

  const toggleRemoval = (removalId, checked) => {
    const isChecked = Boolean(checked);
    setSelectedRemovals((prev) => {
      if (isChecked) return Array.from(new Set([...prev, removalId]));
      return prev.filter((id) => id !== removalId);
    });
  };

  const handleAddCustomAddon = () => {
    const label = newAddonLabel.trim();
    if (!label) return;
    const price = Number(newAddonPrice) || 0;
    const id = `custom-addon-${Date.now()}`;
    setCustomAddons((prev) => [...prev, { id, label, price }]);
    setSelectedAddons((prev) => [...prev, id]);
    setNewAddonLabel("");
    setNewAddonPrice("");
  };

  const handleAddCustomRemoval = () => {
    const label = newRemovalLabel.trim();
    if (!label) return;
    const id = `custom-removal-${Date.now()}`;
    setCustomRemovals((prev) => [...prev, { id, label }]);
    setSelectedRemovals((prev) => [...prev, id]);
    setNewRemovalLabel("");
  };

  const handleApplyAddons = () => {
    if (!customizeItem) return;
    const addons = [...ADD_ONS, ...customAddons].filter((addon) =>
      selectedAddons.includes(addon.id),
    );
    const removals = [...REMOVALS, ...customRemovals].filter((removal) =>
      selectedRemovals.includes(removal.id),
    );
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === customizeItem.id
          ? { ...item, addons, removals, note: noteText.trim() }
          : item,
      ),
    );
    setCustomizeOpen(false);
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Add at least one item before submitting the order.");
      return;
    }

    const selectedDiscount =
      regulatoryDiscountOptions.find((option) => option.value === discountValue) ??
      NONE_DISCOUNT_OPTION;
    const selectedPromo =
      promoDiscountOptions.find((option) => option.value === promoDiscountValue) ??
      NONE_DISCOUNT_OPTION;

    const payload = {
      dine_type: dineType,
      table_no: dineType === "takeout" ? null : tableNo || null,
      server: serverValue || null,
      discount_id:
        selectedDiscount.value === "none"
          ? null
          : toNumberIfPossible(selectedDiscount.value),
      promo_discount_id:
        selectedPromo.value === "none"
          ? null
          : toNumberIfPossible(selectedPromo.value),
      discount_type: selectedDiscount.name ?? "none",
      promo_discount_type: selectedPromo.name ?? "none",
      subtotal: totals.subtotal,
      discount_amount: totals.discountAmount,
      promo_discount_amount: totals.promoAmount,
      tax_amount: totals.taxAmount,
      total: totals.total,
      items: orderItems.map((item) => ({
        menu_item_id: toNumberIfPossible(item.id),
        quantity: item.qty,
        note: item.note || null,
        addons: item.addons?.map((addon) => ({
          id: addon.id,
          name: addon.label,
          price: addon.price,
        })),
        removals: item.removals?.map((removal) => ({
          id: removal.id,
          name: removal.label,
        })),
      })),
    };

    try {
      await createOrder.mutateAsync(payload);
      setOrderItems([]);
      setCustomizeOpen(false);
      setCustomizeItem(null);
      toast.success("Order submitted.");
    } catch (requestError) {
      toast.error(extractErrorMessage(requestError, "Unable to submit order."));
    }
  };

  const hasLoadError =
    categoriesQuery.isError || menuItemsQuery.isError || discountsQuery.isError;
  const loadErrorMessage =
    extractErrorMessage(discountsQuery.error, "") ||
    extractErrorMessage(menuItemsQuery.error, "") ||
    extractErrorMessage(categoriesQuery.error, "Unable to load ordering data.");

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">
      <main className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xs sm:p-5 lg:p-6">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <IButton
                  type="button"
                  variant="outline"
                  showLoading={false}
                  className="size-10 rounded-full border-gray-200 p-0 text-gray-600"
                  onClick={() => navigate("/dashboard")}
                  aria-label="Back to dashboard"
                >
                  <ArrowLeft className="size-5" />
                </IButton>
                <Title size="2xl" className="text-gray-900">
                  Take Order
                </Title>
              </div>
              <Badge className="bg-gray-100 text-gray-600">Popular Items</Badge>
            </div>
            <label className="relative flex w-full items-center">
              <Search className="absolute left-3 size-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search menu items..."
                className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-orange/60 focus:ring-2 focus:ring-orange/20"
              />
            </label>
          </header>

          {categoriesQuery.isLoading ||
          menuItemsQuery.isLoading ||
          discountsQuery.isLoading ? (
            <Paragraph size="sm" className="mt-4 text-gray-500">
              Loading categories, menu items, and discounts...
            </Paragraph>
          ) : null}

          {hasLoadError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <Paragraph size="sm" className="text-red-600">
                {loadErrorMessage}
              </Paragraph>
              <div className="mt-2 flex gap-2">
                <IButton
                  type="button"
                  variant="outline"
                  showLoading={false}
                  onClick={() => discountsQuery.refetch()}
                >
                  Retry discounts
                </IButton>
                <IButton
                  type="button"
                  variant="outline"
                  showLoading={false}
                  onClick={() => categoriesQuery.refetch()}
                >
                  Retry categories
                </IButton>
                <IButton
                  type="button"
                  variant="outline"
                  showLoading={false}
                  onClick={() => menuItemsQuery.refetch()}
                >
                  Retry menu items
                </IButton>
              </div>
            </div>
          ) : null}

          <ul className="mt-5 flex flex-nowrap gap-2 overflow-x-auto pb-2">
            {categoryTabs.map((tab) => {
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
                    onClick={() => setSelectedCategory(tab.id)}
                  >
                    <CategoryIcon className="size-4" />
                    <span>{tab.label}</span>
                  </IButton>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <Title size="md" className="text-gray-900">
              Popular Items
            </Title>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => handleAddItem(item)}
                  >
                    <div
                      className={cn(
                        "relative h-36 w-full bg-gradient-to-br",
                        item.accent,
                      )}
                    >
                    </div>
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
              {!categoriesQuery.isLoading &&
              !menuItemsQuery.isLoading &&
              !hasLoadError &&
              filteredItems.length === 0 ? (
                <li className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No available menu items match this filter.
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        <OrderSidebar
          orderId="#ORD-9082"
          dineType={dineType}
          onDineTypeChange={setDineType}
          tableNo={tableNo}
          onTableChange={setTableNo}
          serverValue={serverValue}
          serverOptions={SERVER_OPTIONS}
          onServerChange={setServerValue}
          items={orderItems}
          onQtyChange={handleQtyChange}
          onCustomizeItem={handleCustomizeItem}
          discountValue={discountValue}
          discountOptions={regulatoryDiscountOptions}
          onDiscountChange={setDiscountValue}
          promoDiscountValue={promoDiscountValue}
          promoDiscountOptions={promoDiscountOptions}
          onPromoDiscountChange={setPromoDiscountValue}
          subtotal={totals.subtotal}
          discountAmount={totals.discountAmount}
          promoDiscountAmount={totals.promoAmount}
          taxAmount={totals.taxAmount}
          total={totals.total}
          formatCurrency={formatCurrency}
          onSubmit={handleSubmitOrder}
        />

        <OrderCustomizeModal
          isOpen={customizeOpen}
          onClose={() => setCustomizeOpen(false)}
          itemName={customizeItem?.name}
          addons={[...ADD_ONS, ...customAddons]}
          removals={[...REMOVALS, ...customRemovals]}
          selectedAddons={selectedAddons}
          selectedRemovals={selectedRemovals}
          noteText={noteText}
          onNoteChange={setNoteText}
          onToggleAddon={toggleAddon}
          onToggleRemoval={toggleRemoval}
          newAddonLabel={newAddonLabel}
          onNewAddonLabelChange={setNewAddonLabel}
          newAddonPrice={newAddonPrice}
          onNewAddonPriceChange={setNewAddonPrice}
          onAddCustomAddon={handleAddCustomAddon}
          newRemovalLabel={newRemovalLabel}
          onNewRemovalLabelChange={setNewRemovalLabel}
          onAddCustomRemoval={handleAddCustomRemoval}
          onApply={handleApplyAddons}
          formatCurrency={formatCurrency}
        />
      </main>
    </div>
  );
}
