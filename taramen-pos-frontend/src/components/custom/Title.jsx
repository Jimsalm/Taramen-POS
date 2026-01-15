export default function Title({ children, size = "lg", variant = "default", className }) {
   const sizes = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
   };

   const variants = {
      muted: "text-primary-foreground/80",
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-green-600",
      danger: "text-red-600",
      warning: "text-yellow-600",
   };

   return <h1 className={`${sizes[size]} ${variants[variant]} font-bold ${className}`}>{children}</h1>;
}
