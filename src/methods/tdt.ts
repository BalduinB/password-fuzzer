import { shuffle } from "@/lib/arr";
import { calculateClass } from "@/lib/password";
import {
    expandNumberSequence,
    isNumberSequence,
    isOnlyFirstCharUpper,
    onlyFirstCharUpper,
} from "@/lib/string";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

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
        const rest = this.getRestElements();

        for (const number of rest.numbers) {
            this.fuzzNumber(number);
        }
        this.enshureSpezials();

        for (const alpha of alpaStrings) {
            this.fuzzAlpha(alpha);
        }
        console.log({
            numbers: this.fuzzedNumbers.length,
            alphas: this.fuzzedAlphas.length,
            specials: this.fuzzedSpecials.length,
        });
        this.createFuzzedPasswords();
        return this.results;
    }

    getAlphaElements() {
        const res = this.pw.password.match(/[a-zA-Z]+/g);

        return res || [];
    }

    getRestElements() {
        const spezials = this.pw.password.match(/[^a-zA-Z0-9]+/g) ?? [];
        const numbers =
            this.pw.password.match(/[0-9]+/g) ?? POPULAR_NUMBER_PARTS;

        return { spezials, numbers };
    }
    private createFuzzedPasswords() {
        this.results.push(...this.fuzzedAlphas);

        const upperPwClass = calculateClass(
            this.pw.password.toUpperCase(),
        ).split("");
        this.compinePassowords(upperPwClass);
    }
    private compinePassowords(pwClass: Array<string>) {
        for (const classItem of pwClass) {
            const stringsToUse = this.getStringToUse(classItem);
            const restClass = pwClass.slice(1);
            for (const str of stringsToUse) {
                for (const res of this.results) {
                    this.results.push(res + str);
                }
            }
        }
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

        if (!isOnlyFirstCharUpper(str)) {
            this.fuzzedAlphas.push(onlyFirstCharUpper(str));
        }
    }

    private enshureSpezials() {
        this.fuzzedSpecials.push(...POPULAR_SPEZIAL_PARTS);
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

const POPULAR_NUMBER_PARTS = ["12", "13", "11", "22", "23", "07"];
const POPULAR_SPEZIAL_PARTS = ["!", ".", "*", "@", "$", "-", "?", "(", ")"];

function raiseError(message: string): never {
    throw new Error(message);
}
