import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import TakeOrderCategoryTabs from "@/components/features/take-order/TakeOrderCategoryTabs";
import {
  ADD_ONS,
  ALL_CATEGORY_TAB,
  CATEGORY_ICON_OPTIONS,
  ITEM_ACCENTS,
  NONE_DISCOUNT_OPTION,
  REMOVALS,
} from "@/components/features/take-order/constants";
import TakeOrderHeader from "@/components/features/take-order/TakeOrderHeader";
import TakeOrderMenuGrid from "@/components/features/take-order/TakeOrderMenuGrid";
import IButton from "@/components/custom/Button";
import OrderCustomizeModal from "@/components/features/take-order/OrderCustomizeModal";
import OrderSidebar from "@/components/features/take-order/OrderSidebar";
import Paragraph from "@/components/custom/Paragraph";
import {
  useAvailableMenuItems,
  useCategories,
  useCreateOrder,
  useDiscounts,
  useEmployees,
} from "@/hooks/usePosApi";
import { extractErrorMessage } from "@/shared/helpers/extractErrorMessage";
import useTakeOrderStore, { getCustomizeItem } from "@/stores/useTakeOrderStore";
import {
  formatCurrency,
  toDiscountOption,
  toNumberIfPossible,
} from "./utils";
import useOrderTotals from "./useOrderTotals";

export default function TakeOrder() {
  const navigate = useNavigate();
  const employeesQuery = useEmployees();
  const categoriesQuery = useCategories();
  const menuItemsQuery = useAvailableMenuItems();
  const discountsQuery = useDiscounts();
  const createOrder = useCreateOrder();
  const {
    tableNumber,
    employeeId,
    discountValue,
    promoDiscountValue,
    dineType,
    orderItems,
    selectedCategory,
    searchTerm,
  } = useTakeOrderStore(
    useShallow((state) => ({
      tableNumber: state.tableNumber,
      employeeId: state.employeeId,
      discountValue: state.discountValue,
      promoDiscountValue: state.promoDiscountValue,
      dineType: state.dineType,
      orderItems: state.orderItems,
      selectedCategory: state.selectedCategory,
      searchTerm: state.searchTerm,
    })),
  );
  const {
    customize,
    customData,
  } = useTakeOrderStore(
    useShallow((state) => ({
      customize: state.customize,
      customData: state.customData,
    })),
  );
  const {
    setTable,
    setEmployee,
    setDiscountValue,
    setPromoDiscountValue,
    setDineType,
    setSelectedCategory,
    setSearchTerm,
    setCustomizeNote,
    setNewAddonLabel,
    setNewAddonPrice,
    setNewRemovalLabel,
    ensureEmployeeId,
    addItem,
    changeItemQty,
    openCustomize,
    closeCustomize,
    toggleAddon,
    toggleRemoval,
    addCustomAddon,
    addCustomRemoval,
    applyCustomization,
    clearSubmittedOrder,
  } = useTakeOrderStore(
    useShallow((state) => ({
      setTable: state.setTable,
      setEmployee: state.setEmployee,
      setDiscountValue: state.setDiscountValue,
      setPromoDiscountValue: state.setPromoDiscountValue,
      setDineType: state.setDineType,
      setSelectedCategory: state.setSelectedCategory,
      setSearchTerm: state.setSearchTerm,
      setCustomizeNote: state.setCustomizeNote,
      setNewAddonLabel: state.setNewAddonLabel,
      setNewAddonPrice: state.setNewAddonPrice,
      setNewRemovalLabel: state.setNewRemovalLabel,
      ensureEmployeeId: state.ensureEmployeeId,
      addItem: state.addItem,
      changeItemQty: state.changeItemQty,
      openCustomize: state.openCustomize,
      closeCustomize: state.closeCustomize,
      toggleAddon: state.toggleAddon,
      toggleRemoval: state.toggleRemoval,
      addCustomAddon: state.addCustomAddon,
      addCustomRemoval: state.addCustomRemoval,
      applyCustomization: state.applyCustomization,
      clearSubmittedOrder: state.clearSubmittedOrder,
    })),
  );
  const customizeItem = useTakeOrderStore(getCustomizeItem);

  useEffect(() => {
    const firstEmployeeId = employeesQuery.data?.[0]?.id;
    if (firstEmployeeId) {
      ensureEmployeeId(firstEmployeeId);
    }
  }, [employeesQuery.data, ensureEmployeeId]);

  const categoryTabs = useMemo(
    () => [
      ALL_CATEGORY_TAB,
      ...(categoriesQuery.data ?? []).map((category, index) => ({
        id: String(category.id),
        label: category.name,
        icon:
          CATEGORY_ICON_OPTIONS[index % CATEGORY_ICON_OPTIONS.length] ??
          ALL_CATEGORY_TAB.icon,
      })),
    ],
    [categoriesQuery.data],
  );

  const employeeOptions = useMemo(
    () =>
      (employeesQuery.data ?? []).map((employee) => ({
        value: String(employee.id),
        label: employee.name,
      })),
    [employeesQuery.data],
  );

  const discountOptions = useMemo(
    () =>
      (discountsQuery.data ?? [])
        .filter((discount) => discount.active)
        .map(toDiscountOption),
    [discountsQuery.data],
  );

  const regularDiscountOptions = useMemo(() => {
    const regular = discountOptions.filter(
      (option) => !option.category.includes("promo"),
    );
    const options = regular.length > 0 ? regular : discountOptions;
    return [NONE_DISCOUNT_OPTION, ...options];
  }, [discountOptions]);

  const promoDiscountOptions = useMemo(() => {
    const promos = discountOptions.filter((option) =>
      option.category.includes("promo"),
    );
    const options = promos.length > 0 ? promos : discountOptions;
    return [NONE_DISCOUNT_OPTION, ...options];
  }, [discountOptions]);

  const totals = useOrderTotals({
    orderItems,
    discountValue,
    promoDiscountValue,
    regularDiscountOptions,
    promoDiscountOptions,
    noneDiscountOption: NONE_DISCOUNT_OPTION,
  });

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (menuItemsQuery.data ?? [])
      .filter((item) => item.available)
      .map((item, index) => ({
        ...item,
        accent: ITEM_ACCENTS[index % ITEM_ACCENTS.length],
      }))
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "all" ||
          String(item.category_id) === String(selectedCategory);
        if (!matchesCategory) return false;
        if (!term) return true;
        return (
          item.name.toLowerCase().includes(term) ||
          String(item.description ?? "").toLowerCase().includes(term)
        );
      });
  }, [menuItemsQuery.data, selectedCategory, searchTerm]);

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Add at least one item before submitting the order.");
      return;
    }

    const selectedDiscount =
      regularDiscountOptions.find((option) => option.value === discountValue) ??
      NONE_DISCOUNT_OPTION;
    const payload = {
      employee_id: employeeId ? toNumberIfPossible(employeeId) : null,
      table_number: dineType === "takeout" ? "takeout" : tableNumber || null,
      items: orderItems.map((item) => ({
        menu_item_id: toNumberIfPossible(item.id),
        quantity: item.qty,
        discount_id:
          selectedDiscount.value === "none"
            ? null
            : toNumberIfPossible(selectedDiscount.value),
      })),
    };

    try {
      await createOrder.mutateAsync(payload);
      clearSubmittedOrder();
      toast.success("Order submitted.");
    } catch (requestError) {
      toast.error(extractErrorMessage(requestError, "Unable to submit order."));
    }
  };

  const hasLoadError =
    employeesQuery.isError ||
    categoriesQuery.isError ||
    menuItemsQuery.isError ||
    discountsQuery.isError;
  const loadErrorMessage =
    extractErrorMessage(discountsQuery.error, "") ||
    extractErrorMessage(menuItemsQuery.error, "") ||
    extractErrorMessage(employeesQuery.error, "") ||
    extractErrorMessage(categoriesQuery.error, "Unable to load ordering data.");

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">
      <main className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xs sm:p-5 lg:p-6">
          <header className="flex flex-col gap-4">
            <TakeOrderHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onBack={() => navigate("/dashboard")}
            />
          </header>

          {categoriesQuery.isLoading ||
          employeesQuery.isLoading ||
          menuItemsQuery.isLoading ||
          discountsQuery.isLoading ? (
            <Paragraph size="sm" className="mt-4 text-gray-500">
              Loading employees, categories, menu items, and discounts...
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
                  onClick={() => employeesQuery.refetch()}
                >
                  Retry employees
                </IButton>
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

          <TakeOrderCategoryTabs
            categories={categoryTabs}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <TakeOrderMenuGrid
            items={filteredItems}
            isLoading={categoriesQuery.isLoading || menuItemsQuery.isLoading}
            hasError={hasLoadError}
            onAddItem={addItem}
            formatCurrency={formatCurrency}
          />
        </section>

        <OrderSidebar
          orderId="#ORD-9082"
          dineType={dineType}
          onDineTypeChange={setDineType}
          tableNumber={tableNumber}
          onTableNumberChange={setTable}
          employeeValue={employeeId}
          employeeOptions={employeeOptions}
          onEmployeeChange={setEmployee}
          items={orderItems}
          onQtyChange={changeItemQty}
          onCustomizeItem={openCustomize}
          discountValue={discountValue}
          discountOptions={regularDiscountOptions}
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
          isOpen={customize.isOpen}
          onClose={closeCustomize}
          itemName={customizeItem?.name}
          addons={[...ADD_ONS, ...customData.addons]}
          removals={[...REMOVALS, ...customData.removals]}
          selectedAddons={customize.addons}
          selectedRemovals={customize.removals}
          noteText={customize.note}
          onNoteChange={setCustomizeNote}
          onToggleAddon={toggleAddon}
          onToggleRemoval={toggleRemoval}
          newAddonLabel={customize.newAddon.label}
          onNewAddonLabelChange={setNewAddonLabel}
          newAddonPrice={customize.newAddon.price}
          onNewAddonPriceChange={setNewAddonPrice}
          onAddCustomAddon={addCustomAddon}
          newRemovalLabel={customize.newRemoval.label}
          onNewRemovalLabelChange={setNewRemovalLabel}
          onAddCustomRemoval={addCustomRemoval}
          onApply={() => applyCustomization(ADD_ONS, REMOVALS)}
          formatCurrency={formatCurrency}
        />
      </main>
    </div>
  );
}
