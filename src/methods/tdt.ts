import { getGroupMask } from "@/lib/config";
import { calculateClass, calculateElements, calculateElementsWithAlpha } from "@/lib/password";
import {
    countUp,
    expandNumberSequence,
    isNumberSequence,
    onlyFirstCharUpper,
    onlyLastCharUpper,
} from "@/lib/string";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

/** This class implememnts methods from the TDT Modell found in `Password cracking based on learned patterns from disclosed passwords`
 *
 * Fuzzing Workflow:
 * 1. Fuzz Alphastrings (alphanumeric parts)
 * 2. Fuzz Numbers
 * 3. Fuzz Specials
 * 4. Combine all fuzzed parts as Password Class defines
 * @link{https://core.ac.uk/download/pdf/225229085.pdf}
 */
export class TDTMethod implements PasswordFuzzerMethod {
    // private results: Array<string> = [];

    private readonly pw: Password;
    private usePopularNumbers = false;

    constructor(pw: Password) {
        this.pw = pw;
    }

    fuzz() {
        const elements = this.pw.getElementsWithAlphaString();
        const elementsWithOptions = elements.map((element) => {
            const classOfElement = calculateClass(element);
            if (classOfElement === "N") return this.fuzzNumber(element);
            if (classOfElement.includes("U") || classOfElement.includes("L"))
                return this.fuzzAlpha(element);
            if (classOfElement === "S") return this.fuzzSpecial(element);
            if (classOfElement === "X") return [element];
            else return [element];
        });
        console.log(elementsWithOptions);

        return this.createFuzzedPasswords(elementsWithOptions);
    }

    private getRestElements() {
        const spezials = Array.from(this.pw.password.match(/[^a-zA-Z0-9]+/g) ?? []);

        const numbers = Array.from(this.pw.password.match(/[0-9]+/g) ?? []);

        return { spezials, numbers };
    }
    private createFuzzedPasswords(fuzzedElements: Array<Array<string>>) {
        const results: Array<string> = [];

        results.push(...this.compinePassowords(fuzzedElements));

        const fuzzedClassData = this.fuzzClass(fuzzedElements);
        for (const fuzzedClass of fuzzedClassData) {
            results.push(...this.compinePassowords(fuzzedClass));
        }

        return results;
    }

    private compinePassowords(pwClass: Array<Array<string>>) {
        return pwClass.reduce((acc, curr) => {
            if (acc.length === 0) return curr;
            return acc.flatMap((x) => curr.map((y) => x + y));
        }, [] as Array<string>);
    }

    private fuzzClass(fuzzedElements: Array<Array<string>>) {
        // Based on the Top 15 most common classes
        const fuzzed = [];
        if (this.pw.isAlphabeticOnly()) {
            this.usePopularNumbers = true;
            fuzzed.push(
                [...fuzzedElements, POPULAR_NUMBER_PARTS],
                [POPULAR_NUMBER_PARTS, ...fuzzedElements],
                [...fuzzedElements, POPULAR_SINGLE_SPEZIAL_PARTS],
            );
        }
        return fuzzed;
    }

    private fuzzNumber(str: string) {
        const results = [str];

        // Based on the number string length (Table 5)
        if (isNumberSequence(str) && str.length < 4) {
            const expanded = expandNumberSequence(str, Math.min(4, 4 - str.length));
            results.push(...expanded);

            const removed: Array<string> = [];
            const chars = str.split("");
            while (chars.length > 1) {
                chars.pop();
                removed.push(chars.join(""));
            }
            results.push(...removed);
        }
        const counted = countUp(str);
        results.push(...counted);
        if (str === "7") console.log(results);
        return Array.from(new Set(results));
    }

    private fuzzAlpha(str: string) {
        const results = [str];
        const lower = str.toLowerCase();
        const upper = str.toUpperCase();

        results.push(lower);
        results.push(upper);

        results.push(onlyFirstCharUpper(str));
        results.push(onlyLastCharUpper(str));

        return Array.from(new Set(results));
    }

    private fuzzSpecial(str: string) {
        return [str, ...POPULAR_SINGLE_SPEZIAL_PARTS];
    }
}

const POPULAR_NUMBER_PARTS = ["1", "12", "13", "11", "22", "23", "07"];
// Based on the most common special characters (Table 8)
const POPULAR_SINGLE_SPEZIAL_PARTS = ["!", ".", "*", "@"];

function raiseError(message: string): never {
    throw new Error(message);
}
