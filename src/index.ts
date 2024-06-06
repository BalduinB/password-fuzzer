import { Fuzzer } from "./fuzzer";
import { GuesserMethod } from "./fuzzers/guesser";
import { OurMethod } from "./fuzzers/our";
import { TDTMethod } from "./fuzzers/tdt";
import { Password } from "./password";

export function fuzz(pw: string) {
    const fuzzer = getDefaultFuzzer(pw);
    return fuzzer.fuzz();
}

function getDefaultFuzzer(pw: string) {
    return new Fuzzer().register({
        key: "our",
        fuzzerMethod: new OurMethod(new Password(pw)),
    });
}
export { Fuzzer, Password, TDTMethod, GuesserMethod, OurMethod };
