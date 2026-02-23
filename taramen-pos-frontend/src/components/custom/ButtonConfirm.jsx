import { useCallback, useState } from "react";
import useLoadingStore from "@/stores/useLoadingStore";
import { cn } from "@/lib/utils";
import { outlineButtonVariant } from "../ui/button-variants";
import IButton from "./Button";
import ConfirmModal from "./public/ConfirmModal";

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
   const [isOpen, setIsOpen] = useState(false);

   const handleOpen = useCallback((event) => {
      event?.stopPropagation?.();
      setIsOpen(true);
   }, []);

   const handleClose = useCallback(() => {
      setIsOpen(false);
   }, []);

   const handleConfirm = useCallback(() => {
      onConfirm?.();
   }, [onConfirm]);

   if (!isDirty) {
      return (
         <IButton type='button' variant='outline' onClick={onConfirm}>
            Cancel
         </IButton>
      );
   }

   return (
      <>
         <span
            className={className}
            onClick={handleOpen}
            role={asButton ? "button" : undefined}
            tabIndex={asButton ? 0 : undefined}
         >
            {asButton ? (
               <span className={cn(outlineButtonVariant, triggerClassName, "cursor-pointer")}>{children}</span>
            ) : (
               <>{children}</>
            )}
         </span>
         <ConfirmModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            message={message}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            primaryActionVariant={primaryActionVariant}
            onConfirm={handleConfirm}
            onCancel={handleClose}
            isLoading={isLoading}
            className={dialogClassName}
            titleClassName={titleClassName}
            messageClassName={messageClassName}
         />
      </>
   );
}
