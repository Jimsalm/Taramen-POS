import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import IButton from "@/components/custom/Button";
import Modal from "@/components/custom/Modal";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { Checkbox } from "@/components/ui/checkbox";
import { ADD_ONS, REMOVALS } from "@/pages/take-order/take-order-config";
import { formatCurrency } from "@/pages/take-order/utils";
import useTakeOrderStore, { getCustomizeItem } from "@/stores/useTakeOrderStore";

const createDraft = (item) => ({
  selectedAddons: item?.addons?.map((addon) => addon.id) ?? [],
  selectedRemovals: item?.removals?.map((removal) => removal.id) ?? [],
  note: item?.note ?? "",
  newAddonLabel: "",
  newAddonPrice: "",
  newRemovalLabel: "",
  customData: {
    addons: item?.addons?.filter((addon) => String(addon.id).startsWith("custom-addon-")) ?? [],
    removals:
      item?.removals?.filter((removal) => String(removal.id).startsWith("custom-removal-")) ?? [],
  },
});

const selectCustomizeModalState = (state) => ({
  isOpen: state.isCustomizeModalOpen,
  customizeItem: getCustomizeItem(state),
  closeCustomizeModal: state.closeCustomizeModal,
  updateItemCustomization: state.updateItemCustomization,
});

function CustomizeDraft({ closeCustomizeModal, customizeItem, updateItemCustomization }) {
  const [draft, setDraft] = useState(() => createDraft(customizeItem));
  const addons = useMemo(
    () => [...ADD_ONS, ...draft.customData.addons],
    [draft.customData.addons],
  );
  const removals = useMemo(
    () => [...REMOVALS, ...draft.customData.removals],
    [draft.customData.removals],
  );

  const setDraftField = useCallback((key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const toggleAddon = useCallback((addonId, checked) => {
    setDraft((current) => ({
      ...current,
      selectedAddons: checked
        ? Array.from(new Set([...current.selectedAddons, addonId]))
        : current.selectedAddons.filter((id) => id !== addonId),
    }));
  }, []);

  const toggleRemoval = useCallback((removalId, checked) => {
    setDraft((current) => ({
      ...current,
      selectedRemovals: checked
        ? Array.from(new Set([...current.selectedRemovals, removalId]))
        : current.selectedRemovals.filter((id) => id !== removalId),
    }));
  }, []);

  const addCustomAddon = useCallback(() => {
    setDraft((current) => {
      const label = current.newAddonLabel.trim();
      if (!label) return current;

      const addon = {
        id: `custom-addon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        label,
        price: Number(current.newAddonPrice) || 0,
      };

      return {
        ...current,
        customData: {
          ...current.customData,
          addons: [...current.customData.addons, addon],
        },
        selectedAddons: [...current.selectedAddons, addon.id],
        newAddonLabel: "",
        newAddonPrice: "",
      };
    });
  }, []);

  const addCustomRemoval = useCallback(() => {
    setDraft((current) => {
      const label = current.newRemovalLabel.trim();
      if (!label) return current;

      const removal = {
        id: `custom-removal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        label,
      };

      return {
        ...current,
        customData: {
          ...current.customData,
          removals: [...current.customData.removals, removal],
        },
        selectedRemovals: [...current.selectedRemovals, removal.id],
        newRemovalLabel: "",
      };
    });
  }, []);

  const onApply = useCallback(() => {
    if (!customizeItem) return;

    updateItemCustomization(customizeItem.id, {
      addons: addons.filter((addon) => draft.selectedAddons.includes(addon.id)),
      removals: removals.filter((removal) => draft.selectedRemovals.includes(removal.id)),
      note: draft.note.trim(),
    });
    closeCustomizeModal();
  }, [
    addons,
    closeCustomizeModal,
    customizeItem,
    draft.note,
    draft.selectedAddons,
    draft.selectedRemovals,
    removals,
    updateItemCustomization,
  ]);

  return (
    <Modal
      isOpen
      onClose={closeCustomizeModal}
      title={
        <Title size="lg" className="text-gray-900">
          Customize {customizeItem?.name ?? "Item"}
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
        onCancel: closeCustomizeModal,
      }}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Title size="sm" className="text-gray-900">
            Add-ons
          </Title>
          {addons.map((addon) => {
            const checked = draft.selectedAddons.includes(addon.id);
            const priceLabel =
              addon.price === 0
                ? "Free"
                : `${addon.price > 0 ? "+" : "-"}${formatCurrency(Math.abs(addon.price))}`;

            return (
              <label
                key={addon.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => toggleAddon(addon.id, value)}
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
          <div className="grid grid-cols-[1fr_6.25rem_auto] gap-2">
            <input
              value={draft.newAddonLabel}
              onChange={(event) => setDraftField("newAddonLabel", event.target.value)}
              placeholder="Custom add-on"
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            />
            <input
              value={draft.newAddonPrice}
              onChange={(event) => setDraftField("newAddonPrice", event.target.value)}
              placeholder="Price"
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            />
            <IButton
              type="button"
              variant="outline"
              showLoading={false}
              className="h-10 rounded-lg text-sm font-semibold"
              onClick={addCustomAddon}
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
            const checked = draft.selectedRemovals.includes(removal.id);

            return (
              <label
                key={removal.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => toggleRemoval(removal.id, value)}
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
              value={draft.newRemovalLabel}
              onChange={(event) => setDraftField("newRemovalLabel", event.target.value)}
              placeholder="Custom removal"
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            />
            <IButton
              type="button"
              variant="outline"
              showLoading={false}
              className="h-10 rounded-lg text-sm font-semibold"
              onClick={addCustomRemoval}
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
            value={draft.note}
            onChange={(event) => setDraftField("note", event.target.value)}
            placeholder="Type any request..."
            className="min-h-[5.625rem] w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
    </Modal>
  );
}

export default function CustomizeModal() {
  const {
    isOpen,
    customizeItem,
    closeCustomizeModal,
    updateItemCustomization,
  } = useTakeOrderStore(useShallow(selectCustomizeModalState));

  if (!isOpen) return null;

  return (
    <CustomizeDraft
      key={customizeItem?.id ?? "customize"}
      closeCustomizeModal={closeCustomizeModal}
      customizeItem={customizeItem}
      updateItemCustomization={updateItemCustomization}
    />
  );
}
