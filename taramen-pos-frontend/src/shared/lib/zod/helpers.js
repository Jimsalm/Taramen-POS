import { z } from "zod";

export function stringRequired(message = "This field is required") {
   return z.string().min(1, message);
}

export function emailRequired(message = "Valid email is required") {
   return z.string().email(message);
}

export function passwordRequired(minLength = 6, message = `Password must be at least ${minLength} characters`) {
   return z.string().min(minLength, message);
}

export function numberRequired(message = "This field is required") {
   return z.number().min(1, message);
}
