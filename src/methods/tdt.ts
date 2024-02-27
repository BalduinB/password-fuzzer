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

type TDTMOdelConfig = {
    fuzzClass?: boolean;
};
const DEFAULT_TDT_CONFIG: TDTMOdelConfig = {
    fuzzClass: false,
};
/** This class implememnts methods from the TDT Modell found in `Password cracking based on learned patterns from disclosed passwords`
 * @link{https://core.ac.uk/download/pdf/225229085.pdf}
 * @implements PasswordFuzzerMethod
 */
export class TDTMethod implements PasswordFuzzerMethod {
    private results: Array<string> = [];
    private fuzzedNumbers: Array<string> = [];
    private fuzzedAlphas: Array<string> = [];
    private fuzzedSpecials: Array<string> = [];
    private readonly pw: Password;
    private cfg = DEFAULT_TDT_CONFIG;

    constructor(pw: Password, cfg: TDTMOdelConfig = {}) {
        this.pw = pw;
        this.overWriteConfig(cfg);
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
        const fuzzedClass = this.cfg.fuzzClass
            ? this.fuzzClass(upperPwClass)
            : [upperPwClass];

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
    /**
     * This method is used to fuzz the password class,
     * @param pwClass Class of the password as individual chars
     */
    private fuzzClass(pwClass: Array<string>) {
        return [pwClass];
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
    private overWriteConfig(cfg: TDTMOdelConfig) {
        this.cfg = { ...this.cfg, ...cfg };
    }
}

const POPULAR_NUMBER_PARTS = ["1", "12", "13", "11", "22", "23", "07"];
const POPULAR_SPEZIAL_PARTS = ["!", ".", "*", "@", "$", "-", "?", "(", ")"];

function raiseError(message: string): never {
    throw new Error(message);
}
