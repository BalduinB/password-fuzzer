import { describe, expect, test } from "vitest";

import { expandNumberSequence, isNumberSequence } from "@/lib/string";
import { isValidLatinString } from "@/lib/string.js";

describe("lib/string", () => {
    test("isNumberSequence", () => {
        expect(isNumberSequence("1")).toEqual(true);
    });
    test("isNumberSequence", () => {
        expect(expandNumberSequence("1", 2)).toEqual(["12", "123"]);
    });
    test("expandNumberSequence", () => {
        expect(expandNumberSequence("123", 2)).toStrictEqual(["1234", "12345"]);
    });
    test("isValidLatinString", () => {
        expect(
            isValidLatinString.test(
                "alskdfjsdf1234567890ß´!\"§$%&/()=?`+*#'-__dirname.:,;<>^°",
            ),
        ).toEqual(true);
        expect(isValidLatinString.test("als�kdfjsdf")).toEqual(false);
    });
});
