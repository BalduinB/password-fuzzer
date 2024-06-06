import { describe, expect, test } from "vitest";

import { TDTMethod } from "@/fuzzers/tdt";
import { Password } from "@/password";

const testConfig = {
    password: "password1",
    alpaStrings: ["password"],
    rest: { numbers: ["1"], spezials: [] },
    fuzzed: ["password", "PASSWORD", "password1", "PASSWORD1", "password123", "Password12"],
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

    test("Does not take too long", () => {
        const fuzzer = new TDTMethod(new Password("7692171a86d954ca7b"));
        expect(fuzzer).toBeDefined();
    });

    test("Fuzz", () => {
        const result = fuzzer.fuzz();
        for (const res of [testConfig2.password, ...testConfig2.fuzzed]) {
            expect(result).toContain(res);
        }
    });
    test("Compine", () => {
        let result = fuzzer["compinePassowords"]([]);
        expect(result).toStrictEqual([]);
        result = fuzzer["compinePassowords"]([
            ["a", "b"],
            ["c", "d"],
        ]);
        expect(result).toStrictEqual(["ac", "ad", "bc", "bd"]);
        result = fuzzer["compinePassowords"]([
            ["1", "2"],
            ["pass", "Pass"],
            ["$", "-"],
        ]);
        expect(result).toStrictEqual([
            "1pass$",
            "1pass-",
            "1Pass$",
            "1Pass-",
            "2pass$",
            "2pass-",
            "2Pass$",
            "2Pass-",
        ]);
    });
});
