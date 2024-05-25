import { OurMethod } from "@/methods/our";
import { Fuzzer, GuesserMethod, Password, TDTMethod } from "..";

export function fuzzPassword(pw: string) {
    const password = new Password(pw);
    const fuzzer = new Fuzzer();
    const generatedPasswords = fuzzer
        // .register({ fuzzerMethod: new TDTMethod(password), key: "tdt" })
        // .register({ fuzzerMethod: new GuesserMethod(password), key: "guesser" })
        .register({ fuzzerMethod: new OurMethod(password), key: "our" })
        .fuzzKeyed();
    return generatedPasswords.map(({ key, generated }) => ({
        method: key,
        generated: generated.filter((p) => p !== pw),
    }));
}
