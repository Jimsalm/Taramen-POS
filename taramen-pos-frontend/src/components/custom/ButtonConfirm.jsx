import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2Icon } from "lucide-react";
import useLoadingStore from "@/store/loadingStore";
import { cn } from "@/lib/utils";
import { outlineButtonVariant } from "../ui/button-variants";
import IButton from "./Button";

export default function IButtonConfirm({
   children,
   title,
   message,
   onConfirm,
   className,
   cancelLabel = "Cancel",
   confirmLabel = "Confirm",
   dialogClassName = "",
   asButton = false,
   triggerClassName,
   titleClassName,
   messageClassName,
   primaryActionVariant = "default",
   isDirty = true,
}) {
   const isLoading = useLoadingStore((state) => state.isLoading);

   if (!isDirty) {
      return (
         <IButton type='button' variant='outline' onClick={onConfirm}>
            Cancel
         </IButton>
      );
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger className={className} onClick={(e) => e.stopPropagation()}>
            {asButton ? (
               <span className={cn(outlineButtonVariant, triggerClassName, "cursor-pointer")}>{children}</span>
            ) : (
               <>{children}</>
            )}
         </AlertDialogTrigger>
         <AlertDialogContent className={`!max-w-sm p-4 ${dialogClassName}`}>
            <AlertDialogHeader>
               <AlertDialogTitle className={titleClassName}>{title}</AlertDialogTitle>
               <AlertDialogDescription className={messageClassName}>{message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className='border border-outline text-black'>{cancelLabel}</AlertDialogCancel>
               <AlertDialogAction variant={primaryActionVariant} onClick={onConfirm}>
                  {isLoading ? <Loader2Icon /> : confirmLabel}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
