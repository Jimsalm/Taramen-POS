import IButton from "@/components/custom/Button";
import Modal from "@/components/custom/Modal";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { Checkbox } from "@/components/ui/checkbox";

export default function OrderCustomizeModal({
  isOpen,
  onClose,
  itemName,
  addons = [],
  removals = [],
  selectedAddons = [],
  selectedRemovals = [],
  noteText = "",
  onNoteChange,
  onToggleAddon,
  onToggleRemoval,
  newAddonLabel,
  onNewAddonLabelChange,
  newAddonPrice,
  onNewAddonPriceChange,
  onAddCustomAddon,
  newRemovalLabel,
  onNewRemovalLabelChange,
  onAddCustomRemoval,
  onApply,
  formatCurrency = (value) => `$${Number(value).toFixed(2)}`,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Title size="lg" className="text-gray-900">
          Customize {itemName ?? "Item"}
        </Title>
      }
      description={
        <Paragraph size="sm" className="text-gray-500">
          Select add-ons, removals, or special requests.
        </Paragraph>
      }
      primaryAction={{
        label: "Apply",
        onConfirm: onApply,
      }}
      secondaryAction={{
        label: "Cancel",
        onCancel: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Title size="sm" className="text-gray-900">
            Add-ons
          </Title>
          {addons.map((addon) => {
            const checked = selectedAddons.includes(addon.id);
            const priceLabel =
              addon.price === 0
                ? "Free"
                : `${addon.price > 0 ? "+" : "-"}${formatCurrency(
                    Math.abs(addon.price),
                  )}`;
            return (
              <label
                key={addon.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => onToggleAddon?.(addon.id, value)}
                  />
                  <div>
                    <Paragraph size="sm" className="text-gray-900 font-semibold">
                      {addon.label}
                    </Paragraph>
                    <Paragraph size="xs" className="text-gray-500">
                      {priceLabel}
                    </Paragraph>
                  </div>
                </div>
              </label>
            );
          })}
          <div className="grid grid-cols-[1fr_100px_auto] gap-2">
            <input
              value={newAddonLabel}
              onChange={(event) => onNewAddonLabelChange?.(event.target.value)}
              placeholder="Custom add-on"
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            />
            <input
              value={newAddonPrice}
              onChange={(event) => onNewAddonPriceChange?.(event.target.value)}
              placeholder="Price"
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            />
            <IButton
              type="button"
              variant="outline"
              showLoading={false}
              className="h-10 rounded-lg text-sm font-semibold"
              onClick={onAddCustomAddon}
            >
              Add
            </IButton>
          </div>
        </div>

        <div className="space-y-3">
          <Title size="sm" className="text-gray-900">
            Remove / Less
          </Title>
          {removals.map((removal) => {
            const checked = selectedRemovals.includes(removal.id);
            return (
              <label
                key={removal.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      onToggleRemoval?.(removal.id, value)
                    }
                  />
                  <Paragraph size="sm" className="text-gray-900 font-semibold">
                    {removal.label}
                  </Paragraph>
                </div>
              </label>
            );
          })}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={newRemovalLabel}
              onChange={(event) => onNewRemovalLabelChange?.(event.target.value)}
              placeholder="Custom removal"
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            />
            <IButton
              type="button"
              variant="outline"
              showLoading={false}
              className="h-10 rounded-lg text-sm font-semibold"
              onClick={onAddCustomRemoval}
            >
              Add
            </IButton>
          </div>
        </div>

        <div className="space-y-2">
          <Title size="sm" className="text-gray-900">
            Special Request
          </Title>
          <textarea
            value={noteText}
            onChange={(event) => onNoteChange?.(event.target.value)}
            placeholder="Type any request..."
            className="min-h-[90px] w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
    </Modal>
  );
}
