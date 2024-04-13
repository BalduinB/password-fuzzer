import { describe, expect, test } from "vitest";

import { Fuzzer } from "@/fuzzer";
import { fuzzKeyed } from "@/index";

const testConfig = { password1: "Password", password2: "asdf" };

const fuzzer = new Fuzzer();

describe("Show Results", () => {
    test(testConfig.password1, () => {
        const res = fuzzKeyed(testConfig.password1);
        console.log(testConfig.password1, res);
        expect(fuzzer).toBeDefined();
    });
    test(testConfig.password2, () => {
        const res = fuzzKeyed(testConfig.password2);
        console.log(testConfig.password2, res);
        expect(fuzzer).toBeDefined();
    });
});
