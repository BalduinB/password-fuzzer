import { getGroupMask } from "@/lib/config";
import { raiseError } from "@/lib/error";
import { fuzzKeyboardSquenz } from "@/lib/keyboad-sequenz";
import { calculateClass } from "@/lib/password";
import {
    expandNumberSequence,
    isNumberSequence,
    onlyFirstCharUpper,
    onlyLastCharUpper,
} from "@/lib/string";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

type TDTMOdelConfig = {
    fuzzClass?: boolean;
};
const DEFAULT_TDT_CONFIG: TDTMOdelConfig = {
    fuzzClass: true,
};
/** This class uses a mix of both `Guesser` and `TDT` Method to optimize the fuzzing process
 *
 * Fuzzing Workflow:
 * 1. Fuzz Alphastrings (alphanumeric parts)
 * 2. Fuzz Numbers
 * 3. Fuzz Special
 * 4. Combine all fuzzed parts as Password Class defines
 * @link{https://core.ac.uk/download/pdf/225229085.pdf}
 */
export class OurMethod implements PasswordFuzzerMethod {
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
        const rest = this.getRestElements();

        this.keyboardSquenzes();

        for (const alpha of alpaStrings) {
            this.fuzzAlpha(alpha);
        }

        if (!rest.numbers.length) rest.numbers.push(...POPULAR_NUMBER_PARTS);
        for (const number of rest.numbers) {
            this.fuzzNumber(number);
        }

        if (!rest.spezials.length) rest.spezials.push(...POPULAR_SPEZIAL_PARTS);
        for (const spezial of rest.spezials) {
            this.fuzzSpecial(spezial);
        }

        this.createFuzzedPasswords();
        return Array.from(new Set(this.results));
    }

    private keyboardSquenzes() {
        const elements = this.pw.getElements();
        for (const element of elements) {
            const group = this.pw.getGroupOfElement(element);
            const results = fuzzKeyboardSquenz(element);
            if (group === getGroupMask("symbols")) {
                this.fuzzedSpecials.push(...results);
            } else if (group === getGroupMask("numbers")) {
                this.fuzzedNumbers.push(...results);
            } else if (
                group === getGroupMask("lowercase") ||
                group === getGroupMask("uppercase")
            ) {
                this.fuzzedAlphas.push(...results);
            }
        }
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
            );
        return fuzzed;
    }

    private fuzzNumber(str: string) {
        this.fuzzedNumbers.push(str);

        if (isNumberSequence(str)) {
            const expanded = expandNumberSequence(str);
            this.fuzzedNumbers.push(...expanded);
        }
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
const POPULAR_SPEZIAL_PARTS = ["!", ".", "*", "@", "$", "-", "?", "(", ")"];
