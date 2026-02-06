import { z } from "zod";
import { stringRequired } from "../helpers.js";

export const loginSchema = z.object({
   username: stringRequired("Username or Email"),
   password: stringRequired("Password"),
});
