import { getGroupMask } from "@/lib/config";
import { calculateClass } from "@/lib/password";
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
    private results: Array<string> = [];
    private fuzzedNumbers: Array<string> = [];
    private fuzzedAlphas: Array<string> = [];
    private fuzzedSpecials: Array<string> = [];
    private readonly pw: Password;

    constructor(pw: Password) {
        this.pw = pw;
        this.results.push(pw.password);
    }

    fuzz() {
        const alpaStrings = this.getAlphaElements();
        const { numbers, spezials } = this.getRestElements();

        for (const alpha of alpaStrings) {
            this.fuzzAlpha(alpha);
        }

        for (const number of numbers) {
            this.fuzzNumber(number);
        }
        if (!numbers.length) this.fuzzedNumbers.push(...POPULAR_NUMBER_PARTS);

        if (!spezials.length) spezials.push(...POPULAR_SINGLE_SPEZIAL_PARTS);
        for (const spezial of spezials) {
            this.fuzzSpecial(spezial);
        }

        this.createFuzzedPasswords();
        return Array.from(new Set(this.results));
    }

    private getAlphaElements() {
        return Array.from(this.pw.password.match(/[a-zA-Z]+/g) ?? []);
    }

    private getRestElements() {
        let spezials = Array.from(
            this.pw.password.match(/[^a-zA-Z0-9]+/g) ?? [],
        );

        let numbers = Array.from(this.pw.password.match(/[0-9]+/g) ?? []);

        return { spezials, numbers };
    }
    private createFuzzedPasswords() {
        this.results.push(...this.fuzzedAlphas);

        // Upper case class so the Alpha Strings are represented as Uppercase
        const upperPwClass = calculateClass(
            this.pw.password.toUpperCase(),
        ).split("");
        const fuzzedClass = this.fuzzClass(upperPwClass);

        this.compinePassowords(fuzzedClass);
    }

    private compinePassowords(pwClass: Array<Array<string>>) {
        const replaced = pwClass.map((pwClass) =>
            pwClass.map((classItem) => this.getStringToUse(classItem)),
        );
        for (const fuzzedPwClass of replaced) {
            const res = fuzzedPwClass.reduce((acc, curr) => {
                if (acc.length === 0) return curr;
                return acc.flatMap((x) => curr.map((y) => x + y));
            }, [] as Array<string>);
            this.results.push(...res);
        }
    }

    private fuzzClass(pwClass: Array<string>) {
        // Based on the Top 15 most common classes
        const fuzzed = [pwClass];
        if (this.pw.isAlphabeticOnly())
            fuzzed.push(
                [...pwClass, getGroupMask("numbers")],
                [getGroupMask("numbers"), ...pwClass],
                [...pwClass, getGroupMask("symbols")],
            );
        return fuzzed;
    }

    private fuzzNumber(str: string) {
        this.fuzzedNumbers.push(str);

        // Based on the number string length (Table 5)
        if (isNumberSequence(str) && str.length < 4) {
            const expanded = expandNumberSequence(
                str,
                Math.min(4, 4 - str.length),
            );
            this.fuzzedNumbers.push(...expanded);

            const removed: Array<string> = [];
            const chars = str.split("");
            while (chars.length > 0) {
                chars.pop();
                removed.push(chars.join(""));
            }
            this.fuzzedNumbers.push(...removed);
        }
        const counted = countUp(str);
        this.fuzzedNumbers.push(...counted);
    }

    private fuzzAlpha(str: string) {
        this.fuzzedAlphas.push(str);
        const lower = str.toLowerCase();
        const upper = str.toUpperCase();

        this.fuzzedAlphas.push(lower);
        this.fuzzedAlphas.push(upper);

        this.fuzzedAlphas.push(onlyFirstCharUpper(str));
        this.fuzzedAlphas.push(onlyLastCharUpper(str));
        this.fuzzedAlphas = Array.from(new Set(this.fuzzedAlphas));
    }

    private fuzzSpecial(str: string) {
        this.fuzzedSpecials.push(str);
    }

    private getStringToUse(classItem: string) {
        return classItem === "N"
            ? this.fuzzedNumbers
            : classItem === "S"
              ? this.fuzzedSpecials
              : classItem === "U"
                ? this.fuzzedAlphas
                : raiseError("Class not found");
    }
}

const POPULAR_NUMBER_PARTS = ["1", "12", "13", "11", "22", "23", "07"];
// Based on the most common special characters (Table 8)
const POPULAR_SINGLE_SPEZIAL_PARTS = ["!", ".", "*", "@"];

function raiseError(message: string): never {
    throw new Error(message);
}
