import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { cn } from "@/lib/utils"; // Make sure you have a cn utility
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function ILineChart({
   data = [],
   config,
   title,
   description,
   xAxisKey,
   footer,
   wrapperClassName,
   contentClassName,
   chartClassName,
   mode = "monotone",
   emptyMessage = "No data available",
}) {
   const lineKeys = Object.keys(config);

   return (
      <Card className={cn("w-full p-3 shadow-none", wrapperClassName)}>
         {(title || description) && (
            <CardHeader className='px-0 gap-1'>
               <CardTitle>{title}</CardTitle>
               <CardDescription className='text-xs'>{description}</CardDescription>
            </CardHeader>
         )}

         <CardContent className={cn("!px-0", contentClassName)}>
            {data.length > 0 ? (
               <ChartContainer config={config} className={cn("h-full w-full", chartClassName)}>
                  <LineChart
                     accessibilityLayer
                     data={data}
                     margin={{
                        left: 12,
                        right: 12,
                     }}
                  >
                     <CartesianGrid vertical={false} />
                     <XAxis
                        dataKey={xAxisKey}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                     />
                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

                     {lineKeys.map((key) => (
                        <Line
                           type={mode}
                           key={key}
                           dataKey={key}
                           stroke={`var(--color-${key})`}
                           strokeWidth={2}
                           dot={false}
                        />
                     ))}
                  </LineChart>
               </ChartContainer>
            ) : (
               <div className='flex h-full min-h-15 text-sm items-center justify-center text-muted-foreground pb-6'>
                  {emptyMessage}
               </div>
            )}
         </CardContent>

         {footer && <CardFooter className='flex-col items-start gap-2 text-sm px-0'>{footer}</CardFooter>}
      </Card>
   );
}
