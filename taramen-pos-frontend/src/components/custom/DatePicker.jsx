import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { addYears, format } from "date-fns";
import { ChevronDownIcon, Trash2 } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import IButton from "./Button";
import { cn } from "@/lib/utils";

export default function DatePicker({
   name,
   label = "Select Date",
   useForm = true,
   minDate,
   maxDate,
   parseDate = true,
   parseFormat = "yyyy-MM-dd",
   showError = true,
   wrapperClassName = "",
   triggerClassName = "",
   mode = "single",
   defaultMonth,
   numOfMonths = 1,
   value = undefined,
   onChange,
   suffix = <ChevronDownIcon />,
   showClear = true,
   ...props
}) {
   const formContext = useForm ? useFormContext() : null;
   const register = formContext?.register || (() => ({}));
   const setValue = formContext?.setValue;
   const watch = formContext ? useWatch({ name }) : null;
   const errors = formContext?.formState?.errors || {};
   const error = errors?.[name]?.message;

   const [open, setOpen] = useState(false);
   const [localDate, setLocalDate] = useState(undefined);

   const date = useForm ? watch : localDate;

   useEffect(() => {
      if (!useForm) {
         setLocalDate(value);
      }
   }, [value]);

   const handleSelect = useCallback((value) => {
      let formattedVal = null;

      if (value?.from && value?.to) {
         formattedVal = {
            from: format(value.from, parseFormat),
            to: format(value.to, parseFormat),
         };
      } else {
         formattedVal = value ? format(value, parseFormat) : null;
      }

      if (useForm && name && setValue) {
         setValue(name, formattedVal);
         formContext?.clearErrors(name);
      } else {
         setLocalDate(formattedVal);
      }

      if (mode === "single") {
         setOpen(false);
      }

      onChange?.(formattedVal);
   }, []);

   const handleTriggerClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (props.disabled) return;

      setOpen((prev) => !prev);
   };

   const handleDeleteDate = (e) => {
      e.stopPropagation();
      if (useForm && name && setValue) {
         setValue(name, null);
      } else {
         setLocalDate(null);
      }
   };

   return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
         <header className='flex items-center justify-between'>
            {label && <Label className='px-1'>{label}</Label>}

            {date && showClear && (
               <span
                  className='text-destructive text-xs gap-1 flex items-center cursor-pointer'
                  onClick={handleDeleteDate}
               >
                  <Trash2 className='size-3.5' /> Clear
               </span>
            )}
         </header>

         <Popover open={open} onOpenChange={props.disabled ? undefined : setOpen}>
            <PopoverTrigger asChild>
               <div>
                  <IButton
                     id={name || "date-range"}
                     type='button'
                     variant='outline'
                     onClick={handleTriggerClick}
                     className={cn(
                        "w-full bg-gray-100 text-black justify-between !font-normal rounded-md",
                        error ? "border-destructive" : "",
                        triggerClassName
                     )}
                     {...(useForm && name ? register(name) : {})}
                     {...props}
                  >
                     {date?.from && date?.to
                        ? date.from === date.to
                           ? format(date.from, "PP")
                           : `${format(date.from, "PP")} - ${format(date.to, "PP")}`
                        : date
                        ? format(date, "PP")
                        : "Select Date"}
                     {suffix}
                  </IButton>
                  {showError && error && <p className='text-xs font-medium text-red-500 text-start'>{error}</p>}
               </div>
            </PopoverTrigger>

            <PopoverContent className='w-auto overflow-hidden p-0' align='end'>
               <div onClick={(e) => e.preventDefault()}>
                  <Calendar
                     mode={mode}
                     selected={date}
                     captionLayout='dropdown'
                     onSelect={handleSelect}
                     fromYear={minDate ? minDate.getFullYear() : undefined}
                     toYear={maxDate ? maxDate.getFullYear() : addYears(new Date(), 20).getFullYear()}
                     disabled={{ before: minDate, after: maxDate }}
                     initialFocus
                     defaultMonth={defaultMonth}
                     numberOfMonths={numOfMonths}
                  />
               </div>
            </PopoverContent>
         </Popover>
      </div>
   );
}
