import { shuffle } from "@/lib/array";
import { MAX_PASWORDS_PER_METHOD, QWERTY_KEYBOARD, QWERTZ_KEYBOARD } from "@/lib/config";
import { findKeyboardSequenzes, fuzzKeyboardSquenz } from "@/lib/keyboad-sequenz";
import { getLeetedChars, isLeetalble } from "@/lib/leet";
import { isNumberStr, isSymbolStr, isUpperCase } from "@/lib/password";
import { isLetterOnly, removeCharAt } from "@/lib/string";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

export class OurMethod implements PasswordFuzzerMethod {
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
        this.casing();
        this.reverse();
        this.leet();
        this.moveSubString();
        return Array.from(new Set(this.results));
    }
    fuzzingMethodOf(pw: string) {
        this.keyboardSquenzes();
        if (this.results.includes(pw)) return "keyboardSequenz";
        this.delete();
        if (this.results.includes(pw)) return "delete";
        this.insert();
        if (this.results.includes(pw)) return "insert";
        this.casing();
        if (this.results.includes(pw)) return "casing";
        this.reverse();
        if (this.results.includes(pw)) return "reverse";
        this.leet();
        if (this.results.includes(pw)) return "leet";
        this.moveSubString();
        if (this.results.includes(pw)) return "moveSubString";
        else return "unknown"; // either moveSubString or unknown, because moveSubString is random
    }

    private keyboardSquenzes() {
        for (const keyboard of [QWERTZ_KEYBOARD, QWERTY_KEYBOARD]) {
            const sequenzes = findKeyboardSequenzes(this.pw.password, keyboard);
            if (sequenzes.length) console.log(this.pw.password, sequenzes);
            for (const seq of sequenzes) {
                if (seq.length <= 1) continue;
                const results = fuzzKeyboardSquenz(seq, keyboard);
                const idx = this.pw.password.indexOf(seq);
                for (const res of results.filter((r) => r.length > 2)) {
                    this.results.push(
                        this.pw.password.slice(0, idx) +
                            res +
                            this.pw.password.slice(idx + seq.length),
                    );
                }
            }
            if (sequenzes.length) console.log("DONE OUR");
        }
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
                this.results.push(this.pw.password, char);
            }
        }
        if (!this.pw.hasNumbers()) {
            for (const num of POP_NUMBER_CHARS) {
                this.results.push(this.pw.password + num);
            }
        }
        //Top 3 Bigrams and Trigrams
        const nGrams = ["01", "123"];
        for (const nGram of nGrams) {
            this.results.push(...this.addToStartAndEnd(this.pw.password, nGram));
        }
    }
    private addToStartAndEnd(base: string, toAdd: string | number) {
        return [toAdd + base, base + toAdd];
    }
    private casing() {
        const uppered = this.pw.password.toUpperCase();
        const upperedFirst = this.pw.password.slice(0, 1).toUpperCase() + this.pw.password.slice(1);
        const upperedLast =
            this.pw.password.slice(0, -1) + this.pw.password.slice(-1).toUpperCase();
        const upperFirstandLast =
            this.pw.password.slice(0, 1).toUpperCase() +
            this.pw.password.slice(1, -1) +
            this.pw.password.slice(-1).toUpperCase();
        const lower = this.pw.password.toLowerCase();
        this.results.push(uppered, upperedFirst, upperedLast, upperFirstandLast, lower);
    }
    private reverse() {
        this.results.push(this.pw.password.split("").reverse().join(""));
    }
    private leet() {
        // not leeting letters to synonims
        const elements = this.pw.getElements();
        let index = -1;
        for (const element of elements) {
            index++;
            if (element.length > 1 || !isLeetalble(element, LEET_MAP)) continue;
            const prev = elements[index - 1];
            const next = elements[index + 1];
            if ((prev && !isLetterOnly(prev)) || (next && !isLetterOnly(next))) continue;
            const leeted = getLeetedChars(element, LEET_MAP);
            for (const leet of leeted) {
                this.results.push(elements.with(index, leet).join(""));
            }
        }
    }
    private moveSubString() {
        const elements = this.pw.getElements();
        for (let i = 0; i < 3; i++) {
            const randomized = shuffle(elements);
            this.results.push(randomized.join(""));
        }
    }
}
const POP_SPEZIAL_CHARS = ["!", "?", "@", ".", "*"];
const POP_NUMBER_CHARS = ["0", "1", "2", "3", "8"];

export const LEET_MAP: Record<string, Array<string>> = {
    o: ["0"],
    a: ["4", "@"],
    s: ["$"],
    i: ["1"],
    e: ["3"],
    t: ["7"],
};
