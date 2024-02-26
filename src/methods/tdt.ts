import { isNumberSequence } from "@/lib/string";
import { Password } from "@/password";
import { PasswordFuzzerMethod } from "@/types/fuzzer";

export class TDTMethod implements PasswordFuzzerMethod {
    private results: Array<string> = [];
    private fuzzedNumbers: Array<string> = [];
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
        for (const special of rest.spezials) {
            this.fuzzSpecial(special);
        }

        return this.results;
    }

    fuzzNumber(part: string) {
        this.fuzzedNumbers.push(part);

        if (isNumberSequence(part)) {
        }
    }
    fuzzAlpha(part: string) {}

    fuzzSpecial(part: string) {}

    getAlphaElements() {
        const res = this.pw.password.match(/[a-zA-Z]+/g);

        return res || [];
    }

    getRestElements() {
        const spezials = this.pw.password.match(/[^a-zA-Z0-9]+/g) ?? [];
        const numbers = this.pw.password.match(/[0-9]+/g) ?? [];

        return { spezials, numbers };
    }
}

const POPULAR_NUMBER_PARTS = ["12", "13", "11", "22", "23", "07"];
