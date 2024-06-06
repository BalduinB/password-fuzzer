import { describe, expect, test } from "vitest";

import { GuesserMethod } from "@/fuzzers/guesser";
import { Password } from "@/password";

const testConfig = {
    password: "password123",
    fuzzed: [
        "password12",
        "1password",
        "PASSWORD",
        "Password",
        "passworD",
        "p@ssword",
        "passw0rd",
        "pas$word",
    ],
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
