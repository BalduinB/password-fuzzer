import { describe, expect, test } from "vitest";

import { fuzz } from "@/index";

const testConfig = {
    password: "Password1",
    fuzzed: [
        "Password1",
        "1Password",
        "Password",
        "Password12",
        "Password123",
        "Password123",
        "Password0",
        "Password2",
        "Password3",
    ],
};

describe("fuzz abstraction", () => {
    const res = fuzz(testConfig.password);
    test("defined", () => {
        expect(res).toBeDefined();
    });
    test("length", () => {
        console.log(`Amount: ${res.length}`);
        expect(res.length).toBeGreaterThan(1);
    });
    test("contains", () => {
        for (const results of testConfig.fuzzed) {
            expect(res).toContain(results);
        }
    });
    test("handle many passwort elements", () => {
        fuzz("informatik12sich54-:erheit");
    });
});
