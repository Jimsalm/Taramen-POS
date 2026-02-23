import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ITooltip({
   children,
   label,
   className,
   tooltipClassName,
   tooltipWrapperClassName,
   placement = "top",
   sideOffset = -3,
   variant = "default",
}) {
   return (
      <Tooltip className={tooltipWrapperClassName}>
         <TooltipTrigger className={className}>{children}</TooltipTrigger>
         {label && (
            <TooltipContent sideOffset={sideOffset} className={tooltipClassName} side={placement} variant={variant}>
               <p>{label}</p>
            </TooltipContent>
         )}
      </Tooltip>
   );
}
