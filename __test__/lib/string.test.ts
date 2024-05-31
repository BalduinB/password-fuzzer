import { describe, expect, test } from "vitest";

import {
    expandNumberSequence,
    isNumberSequence,
    upperFirst,
    upperFirstAndLast,
    upperLast,
} from "@/lib/string";
import { calculateElementsWithAlpha } from "@/lib/password";

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
    test("calculateElementsWithAlpha", () => {
        expect(calculateElementsWithAlpha("-PassWort12")).toStrictEqual(["-", "PassWort", "12"]);
        expect(calculateElementsWithAlpha("-Pass~Wort12")).toStrictEqual([
            "-",
            "Pass",
            "~",
            "Wort",
            "12",
        ]);
        expect(calculateElementsWithAlpha("michiiii")).toStrictEqual(["michiiii"]);
    });
    test("casing", () => {
        const testString = "passWort12asd";
        expect(upperFirst(testString)).toEqual("PassWort12asd");
        expect(upperLast(testString)).toEqual("passWort12asD");
        expect(upperFirstAndLast(testString)).toEqual("PassWort12asD");
        const testString2 = "3 ";
        expect(upperFirst(testString2)).toEqual(testString2);
        expect(upperLast(testString2)).toEqual(testString2);
        expect(upperFirstAndLast(testString2)).toEqual(testString2);
    });
});
