import { ArrowLeft, Search } from "lucide-react";

import IButton from "@/components/custom/Button";
import Title from "@/components/custom/Title";
import { Badge } from "@/components/ui/badge";
import useTakeOrderStore from "@/stores/useTakeOrderStore";

export default function TakeOrderHeader({ onBack }) {
  const searchTerm = useTakeOrderStore((state) => state.searchTerm);
  const setField = useTakeOrderStore((state) => state.setField);

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IButton
            type="button"
            variant="outline"
            showLoading={false}
            className="size-10 rounded-full border-gray-200 p-0 text-gray-600"
            onClick={onBack}
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
          onChange={(event) => setField("searchTerm", event.target.value)}
          placeholder="Search menu items..."
          className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-orange/60 focus:ring-2 focus:ring-orange/20"
        />
      </label>
    </header>
  );
}
