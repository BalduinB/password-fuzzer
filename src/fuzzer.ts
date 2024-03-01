import { Password } from "./password";
import { PasswordFuzzerMethod } from "./types/fuzzer";

export class Fuzzer {
    private methods: Array<PasswordFuzzerMethod> = [];

    register(method: PasswordFuzzerMethod) {
        this.methods.push(method);
        return this;
    }
    fuzzAll() {
        return this.methods.map((method) => method.fuzz());
    }
}
