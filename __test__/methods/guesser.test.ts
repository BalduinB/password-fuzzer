import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { GuesserMethod } from "@/methods/guesser";

const testConfig = {
    password: "password1",
    alpaStrings: ["password"],
    rest: { numbers: ["1"], spezials: [] },
    fuzzed: [],
};

const fuzzer = new GuesserMethod(new Password(testConfig.password));

describe("Guesser Model", () => {
    test("Creation", () => {
        expect(fuzzer).toBeDefined();
    });

    test("Fuzz", () => {
        const result = fuzzer.fuzz();
        for (const res of [testConfig.password, ...testConfig.fuzzed]) {
            expect(result).toContain(res);
        }
    });
});
