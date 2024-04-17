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
    fuzzKeyed() {
        const result = this.methods.map(({ cls, key }) => ({
            key,
            generated: cls.fuzz(),
        }));
        return result;
    }
    fuzz() {
        return this.methods.flatMap(({ cls }) => cls.fuzz());
    }
}

function isMethod(method: Method | PasswordFuzzerMethod): method is Method {
    return (method as Method).key !== undefined;
}
