import { ArrowLeft, LayoutGrid, Soup, CupSoda, CakeSlice, Flame, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import IButton from "@/components/custom/Button";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import OrderSidebar from "@/components/custom/OrderSidebar";
import OrderCustomizeModal from "@/components/custom/OrderCustomizeModal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "starters", label: "Starters", icon: Flame },
  { id: "main", label: "Main Course", icon: Soup },
  { id: "beverages", label: "Beverages", icon: CupSoda },
  { id: "desserts", label: "Desserts", icon: CakeSlice },
];

const MENU_ITEMS = [
  {
    id: "salmon",
    name: "Grilled Salmon",
    price: 18,
    details: "Garlic butter, lemon",
    category: "main",
    accent: "from-slate-800 via-slate-700 to-slate-500",
  },
  {
    id: "cheeseburger",
    name: "Cheeseburger",
    price: 12.5,
    details: "Extra cheese, no onion",
    category: "main",
    accent: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    id: "salad",
    name: "Caesar Salad",
    price: 9,
    details: "Romaine, parmesan",
    category: "starters",
    accent: "from-green-400 via-emerald-500 to-lime-500",
  },
  {
    id: "pasta",
    name: "Carbonara",
    price: 14,
    details: "Bacon, parmesan",
    category: "main",
    accent: "from-emerald-700 via-teal-700 to-cyan-700",
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    price: 3,
    details: "Lemon, less ice",
    category: "beverages",
    accent: "from-amber-300 via-orange-300 to-yellow-200",
  },
  {
    id: "cake",
    name: "Chocolate Cake",
    price: 6.5,
    details: "Dine-in",
    category: "desserts",
    accent: "from-stone-600 via-stone-700 to-stone-800",
  },
  {
    id: "soup",
    name: "Pumpkin Soup",
    price: 8,
    details: "Creamy, warm",
    category: "starters",
    accent: "from-orange-300 via-amber-400 to-yellow-300",
  },
  {
    id: "fries",
    name: "French Fries",
    price: 5.5,
    details: "Sea salt",
    category: "starters",
    accent: "from-amber-400 via-yellow-400 to-orange-300",
  },
];

const SERVER_OPTIONS = [
  { value: "john", label: "John Doe" },
  { value: "maria", label: "Maria Cruz" },
  { value: "kevin", label: "Kevin Lee" },
];

const DISCOUNT_OPTIONS = [
  { value: "none", label: "None", rate: 0 },
  { value: "senior", label: "Senior (20%)", rate: 0.2 },
  { value: "pwd", label: "PWD (20%)", rate: 0.2 },
];

const PROMO_OPTIONS = [
  { value: "none", label: "None", amount: 0 },
  { value: "lunch", label: "Lunch (-$5)", amount: 5 },
  { value: "vip", label: "VIP (-$3)", amount: 3 },
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

export default function TakeOrder() {
  const navigate = useNavigate();
  const [tableNo, setTableNo] = useState("14");
  const [serverValue, setServerValue] = useState("john");
  const [discountValue, setDiscountValue] = useState("senior");
  const [promoDiscountValue, setPromoDiscountValue] = useState("lunch");
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
    const discountRate =
      DISCOUNT_OPTIONS.find((option) => option.value === discountValue)?.rate ??
      0;
    const discountAmount = subtotal * discountRate;
    const promoAmount =
      PROMO_OPTIONS.find((option) => option.value === promoDiscountValue)
        ?.amount ?? 0;
    const taxable = Math.max(subtotal - discountAmount - promoAmount, 0);
    const taxAmount = taxable * 0.1;
    const total = taxable + taxAmount;
    return { subtotal, discountAmount, promoAmount, taxAmount, total };
  }, [orderItems, discountValue, promoDiscountValue]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.details.toLowerCase().includes(term)
      );
    });
  }, [selectedCategory, searchTerm]);

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

  return (
    <div className="min-h-screen p-6">
      <main className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
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

          <ul className="mt-5 flex flex-nowrap gap-2 overflow-x-auto pb-2">
            {CATEGORY_TABS.map(({ id, label, icon: Icon }) => {
              const isActive = selectedCategory === id;
              return (
                <li key={id}>
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
                    onClick={() => setSelectedCategory(id)}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
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
          discountOptions={DISCOUNT_OPTIONS}
          onDiscountChange={setDiscountValue}
          promoDiscountValue={promoDiscountValue}
          promoDiscountOptions={PROMO_OPTIONS}
          onPromoDiscountChange={setPromoDiscountValue}
          subtotal={totals.subtotal}
          discountAmount={totals.discountAmount}
          promoDiscountAmount={totals.promoAmount}
          taxAmount={totals.taxAmount}
          total={totals.total}
          formatCurrency={formatCurrency}
          onSubmit={() => {}}
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
