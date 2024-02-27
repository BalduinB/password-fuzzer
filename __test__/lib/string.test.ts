import { describe, expect, test } from "vitest";

import { expandNumberSequence } from "@/lib/string";

describe("lib/string", () => {
    test("expandNumberSequence", () => {
        expect(expandNumberSequence("123", 2)).toStrictEqual(["1234", "12345"]);
    });
});
