import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { shuffle } from "@/lib/array";

const testConfig = {
    password: "Password123%",
    mask: "ULLLLLLLNNNS",
    class: "ULNS",
    elements: ["P", "assword", "123", "%"],
};

const pw = new Password(testConfig.password);

describe("Password", () => {
    test("Creation", () => {
        expect(pw).toBeDefined();
    });
    test("Mask", () => {
        expect(pw.getMask()).eq(testConfig.mask);
    });
    test("Class", () => {
        expect(pw.getClass()).eq(testConfig.class);
    });
    test("Elements", () => {
        const elements = pw.getElements();
        expect(elements).toEqual(testConfig.elements);
    });
});
