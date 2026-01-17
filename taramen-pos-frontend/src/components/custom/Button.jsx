import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

export default function IButton({ children, icon, iconPosition, tooltipOffset = -3, ...props }) {
   const isLoading = useSelector((state) => state.loading.isLoading);

   return (
      <Button {...props} disabled={isLoading || props.disabled}>
         {isLoading ? <Loader2Icon className='animate-spin size-5' /> : children}
      </Button>
   );
}
