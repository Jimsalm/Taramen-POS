import { useCallback, useEffect, useMemo } from "react";
import { Settings, Table2, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import IButton from "@/components/custom/Button";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DEFAULT_DISCOUNT_OPTIONS,
  NONE_DISCOUNT_OPTION,
  TAX_RATE,
} from "@/pages/take-order/take-order-config";
import {
  buildOrderPayload,
  calculateDiscountAmount,
  formatCurrency,
} from "@/pages/take-order/utils";
import {
  useCreateOrderMutation,
  useDiscountGroupsQuery,
  useEmployeeOptionsQuery,
} from "@/queries/useTakeOrderQueries";
import { extractErrorMessage } from "@/shared/helpers/extractErrorMessage";
import useTakeOrderStore from "@/stores/useTakeOrderStore";

const selectOrderSidebarState = (state) => ({
  dineType: state.dineType,
  discountValue: state.discountValue,
  employeeId: state.employeeId,
  orderItems: state.orderItems,
  promoDiscountValue: state.promoDiscountValue,
  tableNumber: state.tableNumber,
});

const selectOrderSidebarActions = (state) => ({
  changeItemQty: state.changeItemQty,
  openCustomizeModal: state.openCustomizeModal,
  removeItem: state.removeItem,
  setField: state.setField,
});

export default function OrderSidebar() {
  const {
    dineType,
    discountValue,
    employeeId,
    orderItems,
    promoDiscountValue,
    tableNumber,
  } = useTakeOrderStore(useShallow(selectOrderSidebarState));
  const actions = useTakeOrderStore(useShallow(selectOrderSidebarActions));
  const ensureEmployeeId = useTakeOrderStore((state) => state.ensureEmployeeId);
  const clearSubmittedOrder = useTakeOrderStore((state) => state.clearSubmittedOrder);
  const createOrder = useCreateOrderMutation();
  const { data: employeeOptions = [] } = useEmployeeOptionsQuery();
  const { data: discountGroups } = useDiscountGroupsQuery();
  const regularDiscountOptions =
    discountGroups?.regularDiscountOptions ?? DEFAULT_DISCOUNT_OPTIONS;
  const promoDiscountOptions =
    discountGroups?.promoDiscountOptions ?? DEFAULT_DISCOUNT_OPTIONS;

  useEffect(() => {
    const firstEmployeeId = employeeOptions[0]?.value;
    if (firstEmployeeId) {
      ensureEmployeeId(firstEmployeeId);
    }
  }, [employeeOptions, ensureEmployeeId]);

  const totals = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => {
      const addonsPrice = (item.addons ?? []).reduce(
        (addonSum, addon) => addonSum + addon.price,
        0,
      );

      return sum + (item.price + addonsPrice) * item.qty;
    }, 0);
    const regularDiscount =
      regularDiscountOptions.find((option) => option.value === discountValue) ??
      NONE_DISCOUNT_OPTION;
    const promoDiscount =
      promoDiscountOptions.find((option) => option.value === promoDiscountValue) ??
      NONE_DISCOUNT_OPTION;
    const discountAmount = calculateDiscountAmount(subtotal, regularDiscount);
    const promoAmount = calculateDiscountAmount(subtotal, promoDiscount);
    const taxableAmount = Math.max(subtotal - discountAmount - promoAmount, 0);
    const taxAmount = taxableAmount * TAX_RATE;

    return {
      subtotal,
      discountAmount,
      promoAmount,
      taxAmount,
      total: taxableAmount + taxAmount,
    };
  }, [
    discountValue,
    orderItems,
    promoDiscountOptions,
    promoDiscountValue,
    regularDiscountOptions,
  ]);

  const onSubmit = useCallback(async () => {
    if (orderItems.length === 0) {
      toast.error("Add at least one item before submitting the order.");
      return;
    }

    const payload = buildOrderPayload({
      dineType,
      discountValue,
      employeeId,
      orderItems,
      regularDiscountOptions,
      tableNumber,
      noneDiscountOption: NONE_DISCOUNT_OPTION,
    });

    try {
      await createOrder.mutateAsync(payload);
      clearSubmittedOrder();
      toast.success("Order submitted.");
    } catch (requestError) {
      toast.error(extractErrorMessage(requestError, "Unable to submit order."));
    }
  }, [
    clearSubmittedOrder,
    createOrder,
    dineType,
    discountValue,
    employeeId,
    orderItems,
    regularDiscountOptions,
    tableNumber,
  ]);

  const orderId = "#ORD-9082";
  const hasItems = orderItems.length > 0;
  const discountLabel =
    regularDiscountOptions.find((option) => option.value === discountValue)?.label ??
    "Regulatory";
  const promoLabel =
    promoDiscountOptions.find((option) => option.value === promoDiscountValue)
      ?.label ?? "Promo";

  return (
    <aside className="bg-transparent border border-transparent shadow-none p-0 sticky top-6 h-[calc(100vh-3rem)] flex flex-col">
      <header className="flex items-center justify-between">
        <Title size="lg" className="text-gray-900">
          Current Order
        </Title>
        <Badge className="bg-gray-100 text-gray-600">{orderId}</Badge>
      </header>

      <div className="mt-5">
        <div className="grid grid-cols-2 rounded-full border border-gray-200 bg-gray-50 p-1">
            <IButton
            type="button"
            variant={dineType === "dine-in" ? "taramenRed" : "ghost"}
            showLoading={false}
            className="h-8 rounded-full text-xs font-semibold"
            onClick={() => actions.setField("dineType", "dine-in")}
          >
            Dine In
          </IButton>
          <IButton
            type="button"
            variant={dineType === "takeout" ? "taramenRed" : "ghost"}
            showLoading={false}
            className="h-8 rounded-full text-xs font-semibold"
            onClick={() => actions.setField("dineType", "takeout")}
          >
            Take Out
          </IButton>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="space-y-2">
          <Paragraph size="xs" className="text-gray-500 font-semibold uppercase">
            Table
          </Paragraph>
          <div className="relative">
            <Table2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={tableNumber}
              onChange={(event) => actions.setField("tableNumber", event.target.value)}
              className="h-10 pl-9 text-sm font-semibold"
              inputMode="numeric"
              disabled={dineType === "takeout"}
            />
          </div>
        </label>
        <label className="space-y-2">
          <Paragraph size="xs" className="text-gray-500 font-semibold uppercase">
            Employee
          </Paragraph>
          <Select
            value={employeeId}
            onValueChange={(value) => actions.setField("employeeId", value)}
          >
            <SelectTrigger className="h-10 w-full text-sm font-semibold">
              <User className="size-4 text-gray-400" />
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employeeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        {hasItems ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <ul className="space-y-4">
              {orderItems.map((item) => (
                <li key={item.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl bg-gradient-to-br",
                        item.accent ?? "from-slate-200 via-slate-100 to-white",
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <Title size="sm" className="text-gray-900">
                          {item.name}
                        </Title>
                        <Paragraph size="xs" className="text-gray-500">
                          {item.details}
                        </Paragraph>
                        {item.addons?.length ? (
                          <Paragraph size="xs" className="text-gray-400">
                            Add-ons: {item.addons.map((addon) => addon.label).join(", ")}
                          </Paragraph>
                        ) : null}
                        {item.removals?.length ? (
                          <Paragraph size="xs" className="text-gray-400">
                            Remove: {item.removals.map((removal) => removal.label).join(", ")}
                          </Paragraph>
                        ) : null}
                        {item.note ? (
                          <Paragraph size="xs" className="text-gray-400">
                            Note: {item.note}
                          </Paragraph>
                        ) : null}
                      </div>
                      <Paragraph size="sm" className="text-gray-900 font-semibold">
                        {formatCurrency(
                          (item.price +
                            (item.addons?.reduce(
                              (sum, addon) => sum + addon.price,
                              0,
                            ) ?? 0)) *
                            item.qty,
                        )}
                      </Paragraph>
                    </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-transparent">
                          <IButton
                            type="button"
                            variant="ghost"
                            showLoading={false}
                            className="h-8 w-8 rounded-none border-r border-gray-200 p-0 text-gray-600 hover:bg-transparent"
                            onClick={() => actions.changeItemQty(item.id, -1)}
                          >
                            -
                          </IButton>
                          <Paragraph size="sm" className="px-3 font-semibold text-gray-900">
                            {item.qty}
                          </Paragraph>
                          <IButton
                            type="button"
                            variant="ghost"
                            showLoading={false}
                            className="h-8 w-8 rounded-none border-l border-gray-200 p-0 text-gray-600 hover:bg-transparent"
                            onClick={() => actions.changeItemQty(item.id, 1)}
                          >
                            +
                          </IButton>
                        </div>
                        <div className="flex items-center gap-1">
                          <IButton
                            type="button"
                            variant="ghost"
                            showLoading={false}
                            className="h-8 w-8 rounded-lg p-0 text-gray-400 hover:text-gray-700"
                            onClick={() => actions.openCustomizeModal(item.id)}
                            aria-label="Customize item"
                          >
                            <Settings className="size-4" />
                          </IButton>
                          <IButton
                            type="button"
                            variant="ghost"
                            showLoading={false}
                            className="h-8 w-8 rounded-lg p-0 text-gray-400 hover:text-orange"
                            onClick={() => actions.removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="size-4" />
                          </IButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-1 items-center">
            <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
              <Title size="sm" className="text-gray-900">
                No items yet
              </Title>
              <Paragraph size="sm" className="text-gray-500">
                Add products from the Take Order list to build this ticket.
              </Paragraph>
            </div>
          </div>
        )}
      </div>

      {hasItems ? (
        <>
          <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Paragraph size="xs" className="text-gray-500 font-semibold uppercase">
                  Regulatory Dsc.
                </Paragraph>
                <Select
                  value={discountValue}
                  onValueChange={(value) => actions.setField("discountValue", value)}
                >
                  <SelectTrigger className="h-9 w-full text-xs font-semibold">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {regularDiscountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Paragraph size="xs" className="text-gray-500 font-semibold uppercase">
                  Promo Dsc.
                </Paragraph>
                <Select
                  value={promoDiscountValue}
                  onValueChange={(value) => actions.setField("promoDiscountValue", value)}
                >
                  <SelectTrigger className="h-9 w-full text-xs font-semibold">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {promoDiscountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <Paragraph size="sm" className="text-gray-500">
                  Subtotal
                </Paragraph>
                <Paragraph size="sm" className="text-gray-900 font-semibold">
                  {formatCurrency(totals.subtotal)}
                </Paragraph>
              </div>
              <div className="flex items-center justify-between text-orange">
                <Paragraph size="xs" className="text-orange">
                  {discountLabel}
                </Paragraph>
                <Paragraph size="xs" className="text-orange">
                  - {formatCurrency(totals.discountAmount)}
                </Paragraph>
              </div>
              <div className="flex items-center justify-between text-orange">
                <Paragraph size="xs" className="text-orange">
                  {promoLabel}
                </Paragraph>
                <Paragraph size="xs" className="text-orange">
                  - {formatCurrency(totals.promoAmount)}
                </Paragraph>
              </div>
              <div className="flex items-center justify-between">
                <Paragraph size="sm" className="text-gray-500">
                  Tax (10%)
                </Paragraph>
                <Paragraph size="sm" className="text-gray-900 font-semibold">
                  {formatCurrency(totals.taxAmount)}
                </Paragraph>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Paragraph size="sm" className="text-gray-500">
              Total Amount
            </Paragraph>
            <Title size="2xl" className="text-gray-900">
              {formatCurrency(totals.total)}
            </Title>
          </div>

          <IButton
            type="button"
            variant="taramenRed"
            className="mt-6 w-full rounded-2xl py-6 text-base font-semibold"
            showLoading={false}
            onClick={onSubmit}
          >
            Save & Print Receipt
          </IButton>
        </>
      ) : null}
    </aside>
  );
}
