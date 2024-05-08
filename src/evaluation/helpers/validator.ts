import { z } from "zod";
export const isEmail = z.string().email();
