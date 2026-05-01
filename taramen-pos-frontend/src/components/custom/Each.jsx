import { cn } from "@/lib/utils";

function Fallback({ message, className }) {
   return <p className={cn("text-center text-sm text-muted-foreground", className)}>{message}</p>;
}

export default function Each({
   of = [],
   render,
   fallback = "Nothing to display",
   customFallback,
   noFallback = false,
   fallbackClassName = "",
}) {
   if ((!Array.isArray(of) || of.length === 0) && !noFallback) {
      return customFallback || <Fallback className={cn("mt-12", fallbackClassName)} message={fallback} />;
   }

   return <>{of.map((item, index) => render(item, index))}</>;
}
