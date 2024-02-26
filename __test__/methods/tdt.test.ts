import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { TDTMethod } from "@/methods/tdt";

const testConfig = {
    password: "Password123%asd",
    alpaStrings: ["Password", "asd"],
    restStrings: ["123", "%"],
    fuzzed: [],
};

const fuzzer = new TDTMethod(new Password(testConfig.password));

describe("TDT Modell", () => {
    test("Creation", () => {
        expect(fuzzer).toBeDefined();
    });
    test("Alpha Elements", () => {
        expect(fuzzer.getAlphaElements()).toStrictEqual(testConfig.alpaStrings);
    });
    test("Rest Elements", () => {
        expect(fuzzer.getRestElements()).toStrictEqual(testConfig.restStrings);
    });
    test("Fuzz", () => {
        const result = fuzzer.fuzz();
        for (const res of [testConfig.password, ...testConfig.fuzzed]) {
            expect(result).toContain(res);
        }
    });
});
