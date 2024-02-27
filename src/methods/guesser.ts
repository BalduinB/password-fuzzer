import { getLeetedChars } from "@/lib/config";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

/** This classs implements the guessing method from `The Tangled Web of Password Reuse`
 * @link{https://jbonneau.com/doc/DBCBW14-NDSS-tangled_web.pdf}
 * @implements PasswordFuzzerMethod
 */

type GuesserConfig = {
    leetAlphabet?: boolean;
};

const DEFAULT_GUESSER_CONFIG: GuesserConfig = {
    leetAlphabet: false,
};
export class GuesserMethod implements PasswordFuzzerMethod {
    private results: Array<string> = [];
    private readonly pw: Password;
    private cfg = DEFAULT_GUESSER_CONFIG;

    constructor(pw: Password, cfg: GuesserConfig = {}) {
        this.pw = pw;
        this.overWriteConfig(cfg);
        this.results.push(pw.password);
    }

    fuzz() {
        return this.results;
    }

    private leetAlphabet() {
        const charSet = new Set(this.pw.password.split(""));
        const leetAlphabet = new Map<string, Array<string>>();
        for (const c of charSet) {
            leetAlphabet.set(c, getLeetedChars(c));
        }
    }

    private reverse<T>(arr: Array<T>) {
        return arr.toReversed();
    }

    private overWriteConfig(cfg: GuesserConfig) {
        this.cfg = { ...this.cfg, ...cfg };
    }
}
