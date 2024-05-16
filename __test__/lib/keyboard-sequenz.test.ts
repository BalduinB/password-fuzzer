import {
    keyboardSequenzDirection,
    fuzzKeyboardSquenz,
    findKeyboardSequenzes,
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
        expect(fuzzKeyboardSquenz("123")).toStrictEqual(["asd", "zxc", "qwe"]);
        expect(fuzzKeyboardSquenz("321")).toStrictEqual(["dsa", "cxz", "ewq"]);
        expect(fuzzKeyboardSquenz("rfv")).toStrictEqual(["wsx", "edc", "tgb", "yhn"]);
        expect(fuzzKeyboardSquenz("vfr")).toStrictEqual(["xsw", "cde", "bgt", "nhy"]);
        expect(fuzzKeyboardSquenz("ol.")).toStrictEqual(["ujm", "ik,", "p;/"]);
        expect(fuzzKeyboardSquenz("qaz")).toStrictEqual(["wsx", "edc"]);
        expect(fuzzKeyboardSquenz("qa")).toStrictEqual(["['", "ws", "ed"]);
    });
    test("kbS elements", () => {
        expect(findKeyboardSequenzes("ald")).toStrictEqual([]);
        expect(findKeyboardSequenzes("123")).toStrictEqual(["123"]);
        expect(findKeyboardSequenzes("zxceldop[")).toStrictEqual(["zxc", "op["]);
        expect(findKeyboardSequenzes("?/`-23as😜cv")).toStrictEqual(["23", "as", "cv"]);
    });
});
