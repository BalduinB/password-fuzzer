import { Fuzzer } from "./fuzzer";
import { OurMethod } from "./methods/created";
import { GuesserMethod } from "./methods/guesser";
import { TDTMethod } from "./methods/tdt";
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
