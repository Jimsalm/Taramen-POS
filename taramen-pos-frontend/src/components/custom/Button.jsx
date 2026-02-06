import useLoadingStore from "@/store/useLoadingStore";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

export default function IButton({ children, icon, iconPosition, tooltipOffset = -3, showLoading = true, ...props }) {
   const isLoading = useLoadingStore((state) => state.isLoading);

   return (
      <Button {...props} disabled={isLoading || props.disabled}>
         {isLoading && showLoading ? <Loader2Icon className='animate-spin size-5' /> : children}
      </Button>
   );
}
