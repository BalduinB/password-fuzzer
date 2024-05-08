import { PasswordFuzzerMethod } from "./types/fuzzer";

type Method = { fuzzerMethod: PasswordFuzzerMethod; key: string };
export class Fuzzer {
    private methods: Array<Method> = [];
    register(method: Method | PasswordFuzzerMethod) {
        if (isMethod(method)) {
            this.methods.push(method);
            return this;
        }
        this.methods.push({ fuzzerMethod: method, key: "unknown" });

        return this;
    }
    fuzzKeyed() {
        const result = this.methods.map(({ fuzzerMethod, key }) => ({
            key,
            generated: fuzzerMethod.fuzz(),
        }));
        return result;
    }
    fuzz() {
        return this.methods.flatMap(({ fuzzerMethod }) => fuzzerMethod.fuzz());
    }
}

function isMethod(method: Method | PasswordFuzzerMethod): method is Method {
    return (method as Method).key !== undefined;
}
