import { Fuzzer } from "@/fuzzer";
import { OurMethod } from "@/methods/our";
import { Password } from "@/password";

export function fuzzPassword(pw: string) {
    const password = new Password(pw);
    const fuzzer = new Fuzzer();
    const generatedPasswords = fuzzer
        .register({ fuzzerMethod: new OurMethod(password), key: "guesser" })
        .fuzzKeyed();
    return generatedPasswords.map(({ key, generated }) => ({
        method: key,
        generated: generated.filter((p) => p !== pw),
    }));
}
