import { describe, expect, test } from "vitest";

import { Password } from "@/password";
import { expandNumberSequence } from "@/lib/string";

describe("lib/string", () => {
    test("expandNumberSequence", () => {
        expect(expandNumberSequence("123", 2)).toStrictEqual(["1234", "12345"]);
    });
});
