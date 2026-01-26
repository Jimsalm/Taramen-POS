import { z } from "zod";
import { emailRequired, stringRequired } from "../helpers.js";

export const loginSchema = z.object({
   username: emailRequired(),
   password: stringRequired("Password"),
});
