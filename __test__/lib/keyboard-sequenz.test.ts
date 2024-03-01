import {
    keyboardSequenzDirection,
    fuzzKeyboardSquenz,
} from "@/lib/keyboad-sequenz";
import { describe, expect, test } from "vitest";

describe("lib/keyboardSequenz", () => {
    test("kb Sequenz Direcrion", () => {
        expect(keyboardSequenzDirection("123")).toStrictEqual([0, 1]);
        expect(keyboardSequenzDirection("fdsa")).toStrictEqual([0, -1]);
        expect(keyboardSequenzDirection("rfv")).toStrictEqual([1, 0]);
        expect(keyboardSequenzDirection("bgt")).toStrictEqual([-1, 0]);

        expect(keyboardSequenzDirection("asdfh")).toBe(null);
    });
    test("fuzzed kb Sequenz", () => {
        expect(fuzzKeyboardSquenz("123")).toStrictEqual(["qwe", "asd"]);
        expect(fuzzKeyboardSquenz("321")).toStrictEqual(["ewq", "dsa"]);
        expect(fuzzKeyboardSquenz("rfv")).toStrictEqual(["tgb", "zhn"]);
    });
});
