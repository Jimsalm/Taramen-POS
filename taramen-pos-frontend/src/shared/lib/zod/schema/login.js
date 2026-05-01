import { z } from "zod";
import { emailRequired, stringRequired } from "../helpers.js";

export const loginSchema = z.object({
   email: emailRequired(),
   password: stringRequired("Password"),
});
