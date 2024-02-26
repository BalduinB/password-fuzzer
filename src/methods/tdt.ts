import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

export class TDTMethod implements PasswordFuzzerMethod {
    fuzz(v: Password) {}
    fuzzGroup(part: string) {}
}
