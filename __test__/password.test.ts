import { Password } from "@/password";
import { describe, expect, test } from "vitest";

const pw = new Password("password");

describe("Password", () => {
    test("Person Creation", () => {
        expect(pw).toBeDefined();
    });
});
