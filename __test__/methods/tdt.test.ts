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

const fuzzer = new TDTMethod(new Password(testConfig.password));

describe("TDT Model", () => {
    test("Creation", () => {
        expect(fuzzer).toBeDefined();
    });
    test("Alpha Elements", () => {
        expect(fuzzer.getAlphaElements()).toStrictEqual(testConfig.alpaStrings);
    });
    test("Rest Elements", () => {
        const rest = fuzzer.getRestElements();
        expect(rest.numbers).toStrictEqual(testConfig.rest.numbers);
        expect(rest.spezials).toStrictEqual(testConfig.rest.spezials);
    });
    test("Fuzz", () => {
        const result = fuzzer.fuzz();
        for (const res of [testConfig.password, ...testConfig.fuzzed]) {
            expect(result).toContain(res);
        }
    });
});
