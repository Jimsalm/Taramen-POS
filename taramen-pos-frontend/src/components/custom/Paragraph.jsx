export default function Paragraph({ children, className, size = "xs", variant = "muted" }) {
   const sizes = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
   };

   const variants = {
      muted: "text-muted-foreground",
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-green-600",
      danger: "text-red-600",
      warning: "text-yellow-600",
   };

   return <p className={`${variants[variant]} ${sizes[size]} ${className} text-start`}>{children}</p>;
}
