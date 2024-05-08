import { z } from "zod";
export const isEmailSchema = z.string().email();
export function isEmail(str: string) {
    return isEmailSchema.safeParse(str).success;
}
