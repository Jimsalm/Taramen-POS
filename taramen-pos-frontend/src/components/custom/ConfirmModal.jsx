import Modal from "@/components/custom/Modal";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { cn } from "@/lib/utils";

export default function ConfirmModal({
  isOpen,
  onClose,
  title = "Confirm",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  primaryActionVariant = "default",
  size = "sm",
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  titleClassName,
  messageClassName,
  closeOnOverlayClick = true,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        title ? (
          <Title size="lg" className={cn("text-gray-900", titleClassName)}>
            {title}
          </Title>
        ) : null
      }
      description={
        message ? (
          <Paragraph size="sm" className={cn("text-gray-600", messageClassName)}>
            {message}
          </Paragraph>
        ) : null
      }
      size={size}
      className={className}
      contentClassName={contentClassName}
      headerClassName={cn("gap-2", headerClassName)}
      footerClassName={footerClassName}
      closeOnOverlayClick={closeOnOverlayClick}
      isLoading={isLoading}
      primaryAction={{
        label: confirmLabel,
        onConfirm,
        variant: primaryActionVariant,
      }}
      secondaryAction={{
        label: cancelLabel,
        onCancel,
      }}
    />
  );
}
