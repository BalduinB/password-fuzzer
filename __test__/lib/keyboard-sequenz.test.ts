import {
    keyboardSequenzDirection,
    fuzzKeyboardSquenz,
} from "@/lib/keyboad-sequenz";
import { describe, expect, test } from "vitest";

describe("lib/keyboardSequenz", () => {
    test("kb Sequenz Direcrion", () => {
        expect(keyboardSequenzDirection("123")).toStrictEqual({
            colOff: 1,
            rowOff: 0,
        });
        expect(keyboardSequenzDirection("fdsa")).toStrictEqual({
            colOff: -1,
            rowOff: 0,
        });
        expect(keyboardSequenzDirection("rfv")).toStrictEqual({
            colOff: 0,
            rowOff: 1,
        });
        expect(keyboardSequenzDirection("bgt")).toStrictEqual({
            colOff: 0,
            rowOff: -1,
        });

        expect(keyboardSequenzDirection("asdfh")).toBe(null);
    });
    test("fuzzed kb Sequenz", () => {
        expect(fuzzKeyboardSquenz("123")).toStrictEqual(["asd", "yxc", "qwe"]);
        expect(fuzzKeyboardSquenz("321")).toStrictEqual(["dsa", "cxy", "ewq"]);
        expect(fuzzKeyboardSquenz("rfv")).toStrictEqual([
            "wsx",
            "edc",
            "tgb",
            "zhn",
        ]);
        expect(fuzzKeyboardSquenz("vfr")).toStrictEqual([
            "xsw",
            "cde",
            "bgt",
            "nhz",
        ]);
        expect(fuzzKeyboardSquenz("ol.")).toStrictEqual(["ujm", "ik,", "pö-"]);
        expect(fuzzKeyboardSquenz("qay")).toStrictEqual(["wsx", "edc"]);
        expect(fuzzKeyboardSquenz("qa")).toStrictEqual([
            "üä",
            "+#",
            "ws",
            "ed",
        ]);
    });
});
