import { OurMethod } from "@/methods/our";
import { Password } from "@/password";

export function fuzzPassword(pw: string) {
    const password = new Password(pw);
    return new OurMethod(password).fuzz().filter((p) => p !== pw);
}
