import { describe, expect, test } from "vitest";

import { expandNumberSequence, isNumberSequence } from "@/lib/string";

describe("lib/string", () => {
    test("isNumberSequence", () => {
        expect(isNumberSequence("1")).toEqual(true);
    });
    test("expandNumberSequence", () => {
        expect(expandNumberSequence("1", 2)).toEqual(["12", "123"]);
        expect(expandNumberSequence("1", 2)).toEqual(["12", "123"]);
        expect(expandNumberSequence("123", -4)).toStrictEqual(["12", "1"]);
        expect(expandNumberSequence("1", -2)).toStrictEqual([]);
    });
});
