import { Password } from "@/password";

export interface PasswordFuzzerMethod {
    fuzz(v: Password): Array<string>;
}
