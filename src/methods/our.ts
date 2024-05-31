import { shuffle } from "@/lib/array";
import { QWERTY_KEYBOARD, QWERTZ_KEYBOARD } from "@/lib/config";
import { findKeyboardSequenzes, fuzzKeyboardSquenz } from "@/lib/keyboad-sequenz";
import { getLeetedChars, isLeetalble } from "@/lib/leet";
import { calculateElements, isNumberStr, isSymbolStr, isUpperCase } from "@/lib/password";
import {
    countUpnDown,
    expandNumberSequence,
    isLetterOnly,
    isNumberSequence,
    onlyFirstCharUpper,
    onlyLastCharUpper,
    onlyUpperFirstAndLast,
    removeCharAt,
    upperFirst,
    upperFirstAndLast,
    upperLast,
} from "@/lib/string";
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
        this.postfixes();
        this.numbers();
        this.capAndNumber();
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

        this.postfixes();
        if (this.results.includes(pw)) return "postfixes";

        this.capAndNumber();
        if (this.results.includes(pw)) return "capAndNumber";

        this.numbers();
        if (this.results.includes(pw)) return "numbers";

        this.moveSubString();
        if (this.results.includes(pw)) return "moveSubString";
        else return "unknown"; // either moveSubString or unknown, because moveSubString is random
    }
    private capAndNumber() {
        // From TDT
        const newPassword = onlyFirstCharUpper(this.pw.password);
        const elements = calculateElements(newPassword);
        const numbers = elements.filter(isNumberStr);
        if (numbers.length > 2) return;
        for (const numStr of numbers) {
            const numberAlternatives = [...countUpnDown(numStr)];
            if (isNumberSequence(numStr)) {
                numberAlternatives.push(...expandNumberSequence(numStr, 2));
                const chars = numStr.split("");
                while (chars.length > numStr.length - 3) {
                    if (chars.length === 1) break;
                    chars.pop();
                    numberAlternatives.push(chars.join(""));
                }
            }
            for (const number of numberAlternatives) {
                this.results.push(elements.with(elements.indexOf(numStr), number).join(""));
            }
        }
    }
    private postfixes() {
        // From TDT
        if (!this.pw.isAlphabeticOnly()) return;
        for (const postfix of POP_NUMBER_POSTFIXES_TDT) {
            this.results.push(this.pw.password + postfix);
        }
    }
    private numbers() {
        // From TDT
        const elements = this.pw.getElements();
        let i = -1;
        for (const element of elements) {
            i++;
            if (!isNumberStr(element)) continue;
            const alternatives: Array<string> = [];
            if (isNumberSequence(element)) {
                alternatives.push(...expandNumberSequence(element, 2));
                const chars = element.split("");
                while (chars.length > 0) {
                    chars.pop();
                    alternatives.push(chars.join(""));
                }
            }
            alternatives.push(...countUpnDown(element));
            for (const alt of alternatives) {
                this.results.push(elements.with(i, alt).join(""));
            }
        }
    }
    private keyboardSquenzes() {
        // Own thoughts
        for (const keyboard of [QWERTZ_KEYBOARD, QWERTY_KEYBOARD]) {
            const sequenzes = findKeyboardSequenzes(this.pw.password, keyboard);
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
        }
    }

    private delete() {
        if (this.pw.tooShort()) return;

        const allElements = this.pw.getElements();

        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            if (!element) continue;
            const isDeleteable =
                isNumberStr(element) || isSymbolStr(element) || isUpperCase(element);
            if (!isDeleteable) continue;

            const removedStart = removeCharAt(element, 0);
            this.results.push(allElements.with(i, removedStart).join(""));
            const removedEnd = removeCharAt(element, element.length - 1);
            this.results.push(allElements.with(i, removedEnd).join(""));
        }
    }

    private insert() {
        if (this.pw.tooLong()) return;

        if (!this.pw.hasSpecialChar()) {
            for (const char of POP_SPEZIAL_CHARS) {
                this.results.push(this.pw.password + char);
            }
        }
        if (!this.pw.hasNumbers()) {
            for (const num of POP_NUMBER_CHARS_GUESSER) {
                this.results.push(this.pw.password + num);
            }
        }
        //Top 2 Bigrams and Trigrams
        const nGrams = ["01", "123"];
        for (const nGram of nGrams) {
            this.results.push(this.pw.password + nGram);
        }
    }

    private casing() {
        const uppered = this.pw.password.toUpperCase();
        const lowered = this.pw.password.toLowerCase();
        this.results.push(
            uppered,
            onlyFirstCharUpper(this.pw.password),
            upperFirst(this.pw.password),
            upperLast(this.pw.password),
            upperFirstAndLast(this.pw.password),
            lowered,
        );

        // From TDT
        const elements = this.pw.getElementsWithAlphaString();
        for (const element of elements) {
            if (!isLetterOnly(element) || element.length < 2) continue;
            const options = [
                onlyFirstCharUpper(element),
                onlyLastCharUpper(element),
                onlyUpperFirstAndLast(element),
            ];
            for (const option of options) {
                this.results.push(elements.with(elements.indexOf(element), option).join(""));
            }
        }
    }
    private reverse() {
        this.results.push(this.pw.password.split("").reverse().join(""));
    }
    private leet() {
        const elements = this.pw.getElements();
        let index = -1;
        for (const element of elements) {
            index++;
            if (element.length > 1 || !isLeetalble(element, LEET_MAP)) continue;
            const prev = elements[index - 1];
            const next = elements[index + 1];
            if (prev && !isLetterOnly(prev) && next && !isLetterOnly(next)) continue;
            const leeted = getLeetedChars(element, LEET_MAP);
            for (const leet of leeted) {
                this.results.push(elements.with(index, leet).join(""));
            }
        }
    }
    private moveSubString() {
        const elements = this.pw.getElementsWithAlphaString();
        if (elements.length === 2) this.results.push(elements.toReversed().join(""));
        else if (elements.length < 5) {
            for (let i = 0; i < 3; i++) {
                const randomized = shuffle(elements);
                this.results.push(randomized.join(""));
            }
        }
    }
}
const POP_SPEZIAL_CHARS = ["!", "?", "@", ".", "*"];
const POP_NUMBER_CHARS_GUESSER = ["0", "1", "2", "3", "8"];
const POP_NUMBER_POSTFIXES_TDT = ["1", "11", "12"];

export const LEET_MAP: Record<string, Array<string>> = {
    o: ["0"],
    a: ["4", "@"],
    s: ["$"],
    i: ["1"],
    e: ["3"],
    t: ["7"],
};
