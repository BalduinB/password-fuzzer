import { shuffle } from "@/lib/array";
import { fuzzKeyboardSquenz } from "@/lib/keyboad-sequenz";
import { isNumberStr, isSymbolStr, isUpperCase } from "@/lib/password";
import { removeCharAt } from "@/lib/string";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

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

    constructor(pw: Password) {
        this.pw = pw;

        this.results.push(pw.password);
    }

    fuzz() {
        this.keyboardSquenzes();
        this.delete();
        this.insert();
        this.capitalize();
        this.reverse();
        this.leet();
        this.moveSubString();
        return Array.from(new Set(this.results));
    }

    private keyboardSquenzes() {
        const elements = this.pw.getElements();
        for (const element of elements) {
            if (element.length <= 1) continue;
            const results = fuzzKeyboardSquenz(element);
            const idx = this.pw.password.indexOf(element);
            for (const res of results) {
                this.results.push(
                    this.pw.password.slice(0, idx) +
                        res +
                        this.pw.password.slice(idx + element.length),
                );
            }
        }
        // const sequenzes = findKeyboardSequenzes();
        // for (const seq of sequenzes) {
        //     if (seq.length <= 1) continue;
        //     const results = fuzzKeyboardSquenz(seq);
        //     const idx = this.pw.password.indexOf(seq);
        //     for (const res of results.filter((r) => r.length > 2)) {
        //         this.results.push(
        //             this.pw.password.slice(0, idx) + res + this.pw.password.slice(idx + seq.length),
        //         );
        //     }
        // }
    }

    private delete() {
        if (this.pw.tooShort()) return;

        const allElements = this.pw.getElements();

        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            if (!element) continue;
            const isDeleteable = [isNumberStr, isSymbolStr, isUpperCase].some((fn) => fn(element));
            if (!isDeleteable) continue;

            for (let j = 0; j < element.length; j++) {
                const newElement = removeCharAt(element, j);
                this.results.push(allElements.with(i, newElement).join(""));
            }
        }
    }

    private insert() {
        if (this.pw.tooLong()) return;

        if (!this.pw.hasSpecialChar()) {
            for (const char of POP_SPEZIAL_CHARS) {
                this.results.push(...this.addToStartAndEnd(this.pw.password, char));
            }
        }
        if (!this.pw.hasNumbers()) {
            for (let i = 0; i < 10; i++) {
                this.results.push(...this.addToStartAndEnd(this.pw.password, i));
            }
        }
        //Top 3 Bigrams and Trigrams
        const nGrams = ["08", "01", "07", "123", "087", "007"];
        for (const nGram of nGrams) {
            this.results.push(...this.addToStartAndEnd(this.pw.password, nGram));
        }
    }
    private addToStartAndEnd(base: string, toAdd: string | number) {
        return [toAdd + base, base + toAdd];
    }
    private capitalize() {
        const uppered = this.pw.password.toUpperCase();
        const upperedFirst = this.pw.password.slice(0, 1).toUpperCase() + this.pw.password.slice(1);
        const upperedLast =
            this.pw.password.slice(0, -1) + this.pw.password.slice(-1).toUpperCase();
        const upperFirstandLast =
            this.pw.password.slice(0, 1).toUpperCase() +
            this.pw.password.slice(1, -1) +
            this.pw.password.slice(-1).toUpperCase();

        this.results.push(uppered, upperedFirst, upperedLast, upperFirstandLast);
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
            const idxsOfChar = this.pw.indexesOf(char);
            for (const index of idxsOfChar) {
                for (const leetChar of leet) {
                    const newPw =
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
            const randomized = shuffle(elements);
            this.results.push(randomized.join(""));
        }
    }
}
const POP_SPEZIAL_CHARS = ["!", ".", "*", "@", "_", "?", "-"];

export const LEET_MAP: Record<string, Array<string>> = {
    o: ["0"],
    a: ["4", "@"],
    s: ["$"],
    i: ["1"],
    e: ["3"],
    t: ["7"],
};

export function isLeetalble(c: string) {
    c = c.toLowerCase();
    return c in LEET_MAP || Object.values(LEET_MAP).some((v) => v.includes(c));
}
export function getLeetedChars(char: string) {
    char = char.toLowerCase();

    const leetChars = LEET_MAP[char];
    if (leetChars) return leetChars;

    return Object.entries(LEET_MAP).reduce((possibleReplacements, [k, v]) => {
        if (v.includes(char)) possibleReplacements.push(k);
        return possibleReplacements;
    }, [] as Array<string>);
}
