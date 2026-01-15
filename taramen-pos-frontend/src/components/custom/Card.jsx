import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../shared/lib/utils";

export default function ICard({
   children,
   logo, 
   title,
   description,
   cardClassName = "",
   cardContentClassName = "",
   cardTitleClassName = "",
   cardHeaderClassName = "",
}) {
   return (
      <Card className={cn("w-full !max-w-md border-none shadow-2xl", cardClassName)}>
         {(title || logo) && (
            <CardHeader className={cn('gap-1 items-center pb-2', cardHeaderClassName)}>
               {logo && <div>{logo}</div>}
               {title && (
                  <CardTitle className={cn("text-2xl font-bold tracking-tight", cardTitleClassName)}>
                     {title}
                  </CardTitle>
               )}
               {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
         )}
         <CardContent className={cn("pt-4", cardContentClassName)}>
            {children}
         </CardContent>
      </Card>
   );
}