import { Fuzzer } from "./fuzzer";
import { GuesserMethod } from "./methods/guesser";
import { TDTMethod } from "./methods/tdt";
import { Password } from "./password";

export function fuzz(pw: string) {
    const password = new Password(pw);
    return new Fuzzer()
        .register(new TDTMethod(password))
        .register(new GuesserMethod(password))
        .fuzzAll()
        .flat();
}

export { Fuzzer, Password, TDTMethod, GuesserMethod };
