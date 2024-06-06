import { Fuzzer } from "@/fuzzer";
import { GuesserMethod } from "@/methods/guesser";
import { TDTMethod } from "@/methods/tdt";
import { Password } from "@/password";

export function fuzzPassword(pw: string) {
    const password = new Password(pw);
    const fuzzer = new Fuzzer();
    const generatedPasswords = fuzzer
        .register({ fuzzerMethod: new TDTMethod(password), key: "tdt" })
        .register({ fuzzerMethod: new GuesserMethod(password), key: "guesser" })
        .fuzzKeyed();
    return generatedPasswords.map(({ key, generated }) => ({
        method: key,
        generated: generated.filter((p) => p !== pw),
    }));
}
