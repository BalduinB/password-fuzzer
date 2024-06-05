"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var keyboad_sequenz_1 = require("@/lib/keyboad-sequenz");
var vitest_1 = require("vitest");
(0, vitest_1.describe)("lib/keyboardSequenz", function () {
    (0, vitest_1.test)("kb Sequenz Direcrion", function () {
        (0, vitest_1.expect)((0, keyboad_sequenz_1.keyboardSequenzDirection)("123")).toStrictEqual({
            colOff: 1,
            rowOff: 0,
        });
        (0, vitest_1.expect)((0, keyboad_sequenz_1.keyboardSequenzDirection)("fdsa")).toStrictEqual({
            colOff: -1,
            rowOff: 0,
        });
        (0, vitest_1.expect)((0, keyboad_sequenz_1.keyboardSequenzDirection)("rfv")).toStrictEqual({
            colOff: 0,
            rowOff: 1,
        });
        (0, vitest_1.expect)((0, keyboad_sequenz_1.keyboardSequenzDirection)("bgt")).toStrictEqual({
            colOff: 0,
            rowOff: -1,
        });
        (0, vitest_1.expect)((0, keyboad_sequenz_1.keyboardSequenzDirection)("asdfh")).toBe(null);
    });
    (0, vitest_1.test)("fuzzed kb Sequenz", function () {
        (0, vitest_1.expect)((0, keyboad_sequenz_1.fuzzKeyboardSquenz)("123")).toStrictEqual(["asd", "zxc", "qwe"]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.fuzzKeyboardSquenz)("321")).toStrictEqual(["dsa", "cxz", "ewq"]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.fuzzKeyboardSquenz)("rfv")).toStrictEqual(["wsx", "edc", "tgb", "yhn"]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.fuzzKeyboardSquenz)("vfr")).toStrictEqual(["xsw", "cde", "bgt", "nhy"]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.fuzzKeyboardSquenz)("ol.")).toStrictEqual(["ujm", "ik,", "p;/"]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.fuzzKeyboardSquenz)("qaz")).toStrictEqual(["wsx", "edc"]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.fuzzKeyboardSquenz)("qa")).toStrictEqual(["['", "ws", "ed"]);
    });
    (0, vitest_1.test)("kbS elements", function () {
        (0, vitest_1.expect)((0, keyboad_sequenz_1.findKeyboardSequenzes)("ald")).toStrictEqual([]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.findKeyboardSequenzes)("123")).toStrictEqual(["123"]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.findKeyboardSequenzes)("zxceldop[")).toStrictEqual(["zxc", "op["]);
        (0, vitest_1.expect)((0, keyboad_sequenz_1.findKeyboardSequenzes)("?/`-23as😜cv")).toStrictEqual(["23", "as", "cv"]);
    });
});
