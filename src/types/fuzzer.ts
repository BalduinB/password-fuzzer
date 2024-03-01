import { Password } from "@/password";

export interface PasswordFuzzerMethod {
    fuzz(): Array<string>;
}
