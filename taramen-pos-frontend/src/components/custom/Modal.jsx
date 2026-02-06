import React from "react";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import Suspense from "./Suspense";
import ModalSkeleton from "./ModalSkeleton";

const Modal = ({
   isOpen = false,
   onClose,
   title,
   description,
   children,

   size = "default",
   className,
   contentClassName,
   headerClassName,
   footerClassName,

   showFooter = true,
   primaryAction = {
      label: "Confirm",
   },
   secondaryAction = {
      label: "Cancel",
      onCancel: onClose,
   },

   closeOnOverlayClick = true,
   isLoading = false,
   loadingText = "Loading...",
}) => {
   const sizeClasses = {
      sm: "!max-w-sm",
      default: "!max-w-md",
      lg: "!max-w-lg",
      xl: "!max-w-xl",
      "2xl": "!max-w-2xl",
      "3xl": "!max-w-3xl",
      "4xl": "!max-w-4xl",
      "5xl": "!max-w-5xl",
      full: "!max-w-full m-4",
   };

   return (
      <AlertDialog open={isOpen} closeOnOverlayClick={closeOnOverlayClick} onOpenChange={onClose}>
         <AlertDialogContent className={cn("p-4", sizeClasses[size], className)}>
            <AlertDialogHeader className={cn("gap-0", headerClassName)}>
               {title && <AlertDialogTitle className='text-primary'>{title}</AlertDialogTitle>}
               {description && (
                  <AlertDialogDescription>
                     {description || "Are you sure you want to proceed with this action?"}
                  </AlertDialogDescription>
               )}
            </AlertDialogHeader>

            {isOpen && (
               <Suspense fallback={<ModalSkeleton />}>
                  {isLoading ? (
                     <ModalSkeleton />
                  ) : (
                     children && <div className={cn("my-4", contentClassName)}>{children}</div>
                  )}
               </Suspense>
            )}

            {showFooter && (
               <AlertDialogFooter className={footerClassName}>
                  {secondaryAction && (
                     <AlertDialogCancel
                        onClick={secondaryAction.onCancel}
                        disabled={isLoading}
                        className='border border-outline text-black'
                     >
                        {secondaryAction.label || "Cancel"}
                     </AlertDialogCancel>
                  )}
                  {primaryAction && (
                     <AlertDialogAction
                        onClick={(e) => {
                           if (primaryAction.autoClose === false) e.preventDefault();
                           primaryAction.onConfirm?.();
                        }}
                        disabled={isLoading}
                        variant={primaryAction.variant ?? "default"}
                     >
                        {isLoading ? (
                           <div className='flex items-center gap-2'>
                              <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                              {loadingText}
                           </div>
                        ) : (
                           primaryAction.label || "Confirm"
                        )}
                     </AlertDialogAction>
                  )}
               </AlertDialogFooter>
            )}
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default Modal;
