import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const rawBaseQuery = fetchBaseQuery({
   baseUrl: "http://localhost:8000/api/v1",
   prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
         headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
   },
});
