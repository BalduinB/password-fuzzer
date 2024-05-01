import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { TDTMethod } from "@/methods/tdt";

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
});
