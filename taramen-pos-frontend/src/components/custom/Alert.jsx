import { CircleXIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function IAlert({ title, description, variant = "destructive" }) {
   const isError = variant === "destructive";

   return (
      <Alert variant={variant} className={isError ? "border-destructive/40 bg-red-50" : ""}>
         {isError && <CircleXIcon className='size-4' />}

         {title && (
            <AlertTitle className='text-start flex items-center gap-1 !font-semibold'>
               <p>{title}</p>
            </AlertTitle>
         )}

         {description && <AlertDescription>{description}</AlertDescription>}
      </Alert>
   );
}
