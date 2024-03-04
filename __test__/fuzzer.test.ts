import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { Fuzzer } from "@/fuzzer";
import { TDTMethod } from "@/index";

const testConfig = {
    password: "Password123%",
    mask: "ULLLLLLLNNNS",
    class: "ULNS",
    elements: ["P", "assword", "123", "%"],
};

const fuzzer = new Fuzzer();

describe("Password", () => {
    test("Creation", () => {
        expect(fuzzer).toBeDefined();
    });
    test("Register", () => {
        fuzzer.register(new TDTMethod(new Password(testConfig.password)));
        expect(fuzzer["methods"].length).eq(1);
    });
});
