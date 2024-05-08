import { fuzz } from "@/index";
import { describe, expect, test } from "vitest";

const testConfig = {
    password: "Password1",
    fuzzed: [
        "Password1",
        "1Password",
        "PASSWORD",
        "Password",
        "PassworD",
        "P@ssword",
        "Passw0rd",
        "Pas$word",
        "Password12",
        "Password123",
        "Password1234",
        "Password2",
        "Password3",
        "Password4",
        "password12",
        "password123",
        "password1234",
        "password2",
        "password3",
        "password4",
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
