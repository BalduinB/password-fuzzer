import { shuffle } from "@/lib/array";
import { getLeetedChars } from "@/lib/config";
import { fuzzKeyboardSquenz } from "@/lib/keyboad-sequenz";
import { isNumberStr, isSymbolStr } from "@/lib/password";
import { removeCharAt } from "@/lib/string";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

type GuesserConfig = {
    leetAlphabet?: boolean;
};

const DEFAULT_GUESSER_CONFIG: GuesserConfig = {
    leetAlphabet: false,
};
/** This classs implements the guessing method from `The Tangled Web of Password Reuse`
 *
 * Fuzzing Workflow:
 * 1. keyboardSequenz
 * 2. has min length?
 *  - delete parts
 * 3. has max length?
 *  - insert parts
 * 4. capitalize
 * 5. reverse
 * 6. leet
 * 7. move sub strings
 * 8. move sub words
 * @link{https://jbonneau.com/doc/DBCBW14-NDSS-tangled_web.pdf}
 */
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
        this.keyboardSquenzes();
        if (!this.pw.isTooShort()) this.delete();
        if (!this.pw.isTooLong()) this.insert();
        this.capitalize();
        this.reverse();
        this.leet();
        this.moveSubString();
        return Array.from(new Set(this.results));
    }

    private overWriteConfig(cfg: GuesserConfig) {
        this.cfg = { ...this.cfg, ...cfg };
    }
    private delete() {
        const elements = this.pw.getElements();
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (!element) continue;
            if (isNumberStr(element) || isSymbolStr(element)) {
                for (let j = 0; j < element.length; j++) {
                    const newElement = removeCharAt(element, j);
                    const newElements = [...elements];
                    newElements[i] = newElement;
                    this.results.push(newElements.join(""));
                }
            }
        }
    }
    private keyboardSquenzes() {
        const results = fuzzKeyboardSquenz(this.pw.password);
        this.results.push(...results);
    }
    private insert() {
        if (!this.pw.hasSpecialChar()) {
            for (const char of POP_SPEZIAL_CHARS) {
                this.results.push(this.pw.password + char);
                this.results.push(char + this.pw.password);
            }
        }
        if (!this.pw.hasNumbers()) {
            for (let i = 0; i < 10; i++) {
                this.results.push(this.pw.password + i);
                this.results.push(i + this.pw.password);
            }
        }
    }
    private capitalize() {
        this.results.push(this.pw.password.toUpperCase());
        let uppered =
            this.pw.password.slice(0, 1).toUpperCase() +
            this.pw.password.slice(1);
        this.results.push(uppered);
        uppered =
            this.pw.password.slice(0, -1) +
            this.pw.password.slice(-1).toUpperCase();
        this.results.push(uppered);
    }
    private reverse() {
        this.results.push(this.pw.password.split("").reverse().join(""));
    }
    private leet() {
        const charSet = new Set(this.pw.password.split(""));
        const leetAlphabet = new Map<string, Array<string>>();
        for (const c of charSet) {
            leetAlphabet.set(c, getLeetedChars(c));
        }
        for (const [char, leet] of leetAlphabet) {
            const indexesOfChar = this.pw.indexesOf(char);
            for (const index of indexesOfChar) {
                for (const leetChar of leet) {
                    let newPw =
                        this.pw.password.slice(0, index) +
                        leetChar +
                        this.pw.password.slice(index + 1);
                    this.results.push(newPw);
                }
            }
        }
    }
    private moveSubString() {
        const elements = this.pw.getElements();
        for (let i = 0; i < 5; i++) {
            shuffle(elements);
            this.results.push(elements.join(""));
        }
    }
    private moveSubWord() {
        // TODO: implement
    }
}
const POP_SPEZIAL_CHARS = ["!", ".", "@", "$", "_", "?", "-", "#", "(", ")"];
