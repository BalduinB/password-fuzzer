import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { GuesserMethod } from "@/methods/guesser";

const testConfig = {
    password: "password",
    fuzzed: [
        "password1",
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
