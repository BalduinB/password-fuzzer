import { OurMethod } from "@/methods/created";
import { Fuzzer, GuesserMethod, Password, TDTMethod } from "..";

export function fuzzPassword(pw: string) {
    const password = new Password(pw);
    const fuzzer = new Fuzzer();
    const generatedPasswords = fuzzer
        .register({ cls: new TDTMethod(password), key: "tdt" })
        .register({ cls: new GuesserMethod(password), key: "guesser" })
        .register({ cls: new OurMethod(password), key: "our" })
        .fuzzKeyed();
    return generatedPasswords.map(({ key, generated }) => ({
        method: key,
        generated: generated.filter((p) => p !== pw),
    }));
}
