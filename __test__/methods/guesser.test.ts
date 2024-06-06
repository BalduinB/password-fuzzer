import { describe, expect, test } from "vitest";

import { GuesserMethod } from "@/fuzzers/guesser";
import { Password } from "@/password";

const testConfig = {
    password: "password123",
    fuzzed: ["password12", "passwordqwe", "p@ssword123", "password12", "pas$word123"],
};

const fuzzer = new GuesserMethod(new Password(testConfig.password));

describe("Guesser Model", () => {
    test("Creation", () => {
        expect(fuzzer).toBeDefined();
    });

    test("Fuzz", () => {
        const result = fuzzer.fuzz();
        console.log(`Amount:${result.length}`);
        for (const res of [testConfig.password, ...testConfig.fuzzed]) {
            expect(result).toContain(res);
        }
    });
});
