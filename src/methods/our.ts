import { tooManyGenerations } from "@/evaluation/main";
import { fuzzKeyboardSquenz } from "@/lib/keyboad-sequenz";
import { calculateClass, isTooLong } from "@/lib/password";
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
export class OurMethod implements PasswordFuzzerMethod {
    private readonly pw: Password;

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

        return this.createFuzzedPasswords(elementsWithOptions);
    }

    private createFuzzedPasswords(fuzzedElements: Array<Array<string>>) {
        const results: Array<string> = [];

        results.push(...this.compinePassowords(fuzzedElements));
        const fuzzedClassData = this.fuzzClass(fuzzedElements);
        for (const fuzzedClass of fuzzedClassData) {
            if (results.length > 1000) {
                tooManyGenerations.our++;
                break;
            }
            results.push(...this.compinePassowords(fuzzedClass));
        }
        // Keyboard Squenzes
        results.push(...this.keyboardSquenzes());

        return Array.from(new Set(results));
    }
    private keyboardSquenzes() {
        const pwResults: Array<string> = [];
        const elements = this.pw.getElements();
        for (const element of elements) {
            const results = fuzzKeyboardSquenz(element);
            const indexOfElement = elements.indexOf(element);
            if (results.length === 0) continue;

            pwResults.push(
                ...this.compinePassowords(elements.map((x) => [x]).with(indexOfElement, results)),
            );
        }
        return pwResults;
    }
    private compinePassowords(pwClass: Array<Array<string>>) {
        return pwClass.reduce((acc, curr) => {
            if (acc.length > 1000) {
                tooManyGenerations.our++;
                console.log("Max Passwords reached", acc.length);
                return acc;
            }
            if (acc.length === 0) return curr;
            const resultets = acc.flatMap((x) => curr.map((y) => x + y));
            if (resultets.length > 1000) {
                tooManyGenerations.our++;
                return resultets.slice(0, 1000);
            }
            return resultets;
        }, [] as Array<string>);
    }

    private fuzzClass(fuzzedElements: Array<Array<string>>) {
        // Based on the Top 15 most common classes
        const fuzzed = [];
        if (this.pw.isAlphabeticOnly()) {
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