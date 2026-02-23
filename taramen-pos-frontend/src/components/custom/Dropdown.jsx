import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Each from "./Each";

export default function IDropdown({ children, options, placement = "top", ...props }) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
         {options && (
            <DropdownMenuContent side={placement} className={`w-60 z-50 ${props.className}`}>
               <Each
                  of={options}
                  render={(option, index) => (
                     <DropdownMenuItem key={index} className={option?.className} onClick={option?.onClick}>
                        {option.icon && <option.icon className={`${option.iconClassName} mr-2`} />}
                        {option.label || option.title}
                     </DropdownMenuItem>
                  )}
               />
            </DropdownMenuContent>
         )}
      </DropdownMenu>
   );
}
