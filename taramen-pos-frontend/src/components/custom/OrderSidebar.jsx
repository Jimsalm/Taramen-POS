import { Settings, Table2, Trash2, User } from "lucide-react";

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

export default function OrderSidebar({
  orderId = "#ORD-0000",
  dineType = "dine-in",
  onDineTypeChange,
  tableNo = "",
  onTableChange,
  serverValue = "",
  serverOptions = [],
  onServerChange,
  items = [],
  onQtyChange,
  discountValue = "none",
  discountOptions = [],
  onDiscountChange,
  promoDiscountValue = "",
  promoDiscountOptions = [],
  onPromoDiscountChange,
  subtotal = 0,
  discountAmount = 0,
  promoDiscountAmount = 0,
  taxAmount = 0,
  total = 0,
  formatCurrency = (value) => `$${Number(value).toFixed(2)}`,
  onSubmit,
  onCustomizeItem,
}) {
  const hasItems = items.length > 0;
  const discountLabel =
    discountOptions.find((option) => option.value === discountValue)?.label ??
    "Regulatory";
  const promoLabel =
    promoDiscountOptions.find((option) => option.value === promoDiscountValue)
      ?.label ?? "Promo";

  return (
    <aside className="bg-transparent border border-transparent shadow-none p-0 sticky top-6 h-[calc(100vh-48px)] flex flex-col">
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
            variant={dineType === "dine-in" ? "orange" : "ghost"}
            showLoading={false}
            className="h-8 rounded-full text-xs font-semibold"
            onClick={() => onDineTypeChange?.("dine-in")}
          >
            Dine In
          </IButton>
          <IButton
            type="button"
            variant={dineType === "takeout" ? "orange" : "ghost"}
            showLoading={false}
            className="h-8 rounded-full text-xs font-semibold"
            onClick={() => onDineTypeChange?.("takeout")}
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
              value={tableNo}
              onChange={(event) => onTableChange?.(event.target.value)}
              className="h-10 pl-9 text-sm font-semibold"
              inputMode="numeric"
              disabled={dineType === "takeout"}
            />
          </div>
        </label>
        <label className="space-y-2">
          <Paragraph size="xs" className="text-gray-500 font-semibold uppercase">
            Server
          </Paragraph>
          <Select value={serverValue} onValueChange={onServerChange}>
            <SelectTrigger className="h-10 w-full text-sm font-semibold">
              <User className="size-4 text-gray-400" />
              <SelectValue placeholder="Select server" />
            </SelectTrigger>
            <SelectContent>
              {serverOptions.map((option) => (
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
              {items.map((item) => (
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
                            onClick={() => onQtyChange?.(item.id, -1)}
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
                            onClick={() => onQtyChange?.(item.id, 1)}
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
                            onClick={() => onCustomizeItem?.(item)}
                            aria-label="Customize item"
                          >
                            <Settings className="size-4" />
                          </IButton>
                          <IButton
                            type="button"
                            variant="ghost"
                            showLoading={false}
                            className="h-8 w-8 rounded-lg p-0 text-gray-400 hover:text-orange"
                            onClick={() => onQtyChange?.(item.id, -item.qty)}
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
                <Select value={discountValue} onValueChange={onDiscountChange}>
                  <SelectTrigger className="h-9 w-full text-xs font-semibold">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {discountOptions.map((option) => (
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
                <Select value={promoDiscountValue} onValueChange={onPromoDiscountChange}>
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
                  {formatCurrency(subtotal)}
                </Paragraph>
              </div>
              <div className="flex items-center justify-between text-orange">
                <Paragraph size="xs" className="text-orange">
                  {discountLabel}
                </Paragraph>
                <Paragraph size="xs" className="text-orange">
                  - {formatCurrency(discountAmount)}
                </Paragraph>
              </div>
              <div className="flex items-center justify-between text-orange">
                <Paragraph size="xs" className="text-orange">
                  {promoLabel}
                </Paragraph>
                <Paragraph size="xs" className="text-orange">
                  - {formatCurrency(promoDiscountAmount)}
                </Paragraph>
              </div>
              <div className="flex items-center justify-between">
                <Paragraph size="sm" className="text-gray-500">
                  Tax (10%)
                </Paragraph>
                <Paragraph size="sm" className="text-gray-900 font-semibold">
                  {formatCurrency(taxAmount)}
                </Paragraph>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Paragraph size="sm" className="text-gray-500">
              Total Amount
            </Paragraph>
            <Title size="2xl" className="text-gray-900">
              {formatCurrency(total)}
            </Title>
          </div>

          <IButton
            type="button"
            variant="orange"
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
