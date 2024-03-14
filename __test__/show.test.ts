import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { Fuzzer } from "@/fuzzer";
import { TDTMethod, fuzz } from "@/index";

const testConfig = { password1: "Password", password2: "asdf" };

const fuzzer = new Fuzzer();

describe("Show Results", () => {
    test(testConfig.password1, () => {
        const res = fuzz(testConfig.password1);
        console.log(testConfig.password1, res);
        expect(fuzzer).toBeDefined();
    });
    test(testConfig.password2, () => {
        const res = fuzz(testConfig.password2);
        console.log(testConfig.password2, res);
        expect(fuzzer).toBeDefined();
    });
});
