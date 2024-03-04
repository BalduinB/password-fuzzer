import { PasswordFuzzerMethod } from "./types/fuzzer";

type Method = { cls: PasswordFuzzerMethod; key: string };
export class Fuzzer {
    private methods: Array<Method> = [];
    register(method: Method | PasswordFuzzerMethod) {
        if (isMethod(method)) {
            this.methods.push(method);
            return this;
        }
        this.methods.push({ cls: method, key: "unknown" });

        return this;
    }
    fuzzAll() {
        const result = this.methods.map(({ cls, key }) => ({
            key,
            fuzzed: cls.fuzz(),
        }));
        return result;
    }
    fuzzAllFlat() {
        return this.methods.map(({ cls }) => cls.fuzz());
    }
}

function isMethod(method: Method | PasswordFuzzerMethod): method is Method {
    return (method as Method).key !== undefined;
}
