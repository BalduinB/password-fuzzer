import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { TDTMethod } from "@/methods/tdt";

const testConfig = {
    password: "password1",
    alpaStrings: ["password"],
    rest: { numbers: ["1"], spezials: [] },
    fuzzed: [
        "password",
        "PASSWORD",
        "password1",
        "PASSWORD1",
        "password123",
        "Password12",
    ],
};
const testConfig2 = {
    password: "password",
    alpaStrings: ["password"],
    rest: { numbers: [], spezials: [] },
    fuzzed: ["password", "PASSWORD", "password1", "PASSWORD1", "Password12"],
    fuzzedAlphas: ["password", "PASSWORD", "Password", "passworD"],
};

const fuzzer = new TDTMethod(new Password(testConfig2.password));

describe("TDT Model", () => {
    test("Creation", () => {
        expect(fuzzer).toBeDefined();
    });
    test("Alpha Elements", () => {
        expect(fuzzer["getAlphaElements"]()).toStrictEqual(
            testConfig2.alpaStrings,
        );
    });
    test("Rest Elements", () => {
        const rest = fuzzer["getRestElements"]();
        expect(rest.numbers).toStrictEqual(testConfig2.rest.numbers);
        expect(rest.spezials).toStrictEqual(testConfig2.rest.spezials);
    });
    test("Fuzz", () => {
        const result = fuzzer.fuzz();
        for (const res of [testConfig2.password, ...testConfig2.fuzzed]) {
            expect(result).toContain(res);
        }
    });
    test("Fuzzed Alpha", () => {
        expect(fuzzer["fuzzedAlphas"]).toStrictEqual(testConfig2.fuzzedAlphas);
        //    expect(fuzzer["fuzzedNumbers"]).toStrictEqual(testConfig2.rest.spezials);
    });
});
