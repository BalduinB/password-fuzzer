"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var string_1 = require("@/lib/string");
var password_1 = require("@/lib/password");
(0, vitest_1.describe)("lib/string", function () {
    (0, vitest_1.test)("isNumberSequence", function () {
        (0, vitest_1.expect)((0, string_1.isNumberSequence)("1")).toEqual(true);
    });
    (0, vitest_1.test)("expandNumberSequence", function () {
        (0, vitest_1.expect)((0, string_1.expandNumberSequence)("1", 2)).toEqual(["12", "123"]);
        (0, vitest_1.expect)((0, string_1.expandNumberSequence)("1", 2)).toEqual(["12", "123"]);
        (0, vitest_1.expect)((0, string_1.expandNumberSequence)("123", -4)).toStrictEqual(["12", "1"]);
        (0, vitest_1.expect)((0, string_1.expandNumberSequence)("1", -2)).toStrictEqual([]);
    });
    (0, vitest_1.test)("calculateElementsWithAlpha", function () {
        (0, vitest_1.expect)((0, password_1.calculateElementsWithAlpha)("-PassWort12")).toStrictEqual(["-", "PassWort", "12"]);
        (0, vitest_1.expect)((0, password_1.calculateElementsWithAlpha)("-Pass~Wort12")).toStrictEqual([
            "-",
            "Pass",
            "~",
            "Wort",
            "12",
        ]);
        (0, vitest_1.expect)((0, password_1.calculateElementsWithAlpha)("michiiii")).toStrictEqual(["michiiii"]);
    });
    (0, vitest_1.test)("casing", function () {
        var testString = "passWort12asd";
        (0, vitest_1.expect)((0, string_1.upperFirst)(testString)).toEqual("PassWort12asd");
        (0, vitest_1.expect)((0, string_1.upperLast)(testString)).toEqual("passWort12asD");
        (0, vitest_1.expect)((0, string_1.upperFirstAndLast)(testString)).toEqual("PassWort12asD");
        var testString2 = "3 ";
        (0, vitest_1.expect)((0, string_1.upperFirst)(testString2)).toEqual(testString2);
        (0, vitest_1.expect)((0, string_1.upperLast)(testString2)).toEqual(testString2);
        (0, vitest_1.expect)((0, string_1.upperFirstAndLast)(testString2)).toEqual(testString2);
    });
});
