import { Fuzzer } from "./fuzzer";
import { GuesserMethod } from "./methods/guesser";
import { TDTMethod } from "./methods/tdt";
import { Password } from "./password";

export function fuzzKeyed(pw: string) {
    const fuzzer = getDefaultFuzzer(pw);
    return fuzzer.fuzzKeyed();
}
export function fuzz(pw: string) {
    const fuzzer = getDefaultFuzzer(pw);
    return fuzzer.fuzz();
}

function getDefaultFuzzer(pw: string) {
    return new Fuzzer()
        .register({ cls: new TDTMethod(new Password(pw)), key: "tdt" })
        .register({ cls: new GuesserMethod(new Password(pw)), key: "guesser" });
}
export { Fuzzer, Password, TDTMethod, GuesserMethod };
