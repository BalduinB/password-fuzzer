"use strict";
var __spreadArray =
    (this && this.__spreadArray) ||
    function (to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var password_1 = require("@/password");
var tdt_1 = require("@/fuzzers/tdt");
var testConfig = {
    password: "password1",
    alpaStrings: ["password"],
    rest: { numbers: ["1"], spezials: [] },
    fuzzed: ["password", "PASSWORD", "password1", "PASSWORD1", "password123", "Password12"],
};
var testConfig2 = {
    password: "password",
    alpaStrings: ["password"],
    rest: { numbers: [], spezials: [] },
    fuzzed: ["password", "PASSWORD", "password1", "PASSWORD1", "Password12"],
    fuzzedAlphas: ["password", "PASSWORD", "Password", "passworD"],
};
var fuzzer = new tdt_1.TDTMethod(new password_1.Password(testConfig2.password));
(0, vitest_1.describe)("TDT Model", function () {
    (0, vitest_1.test)("Creation", function () {
        (0, vitest_1.expect)(fuzzer).toBeDefined();
    });
    (0, vitest_1.test)("Does not take too long", function () {
        var fuzzer = new tdt_1.TDTMethod(new password_1.Password("7692171a86d954ca7b"));
        (0, vitest_1.expect)(fuzzer).toBeDefined();
    });
    (0, vitest_1.test)("Fuzz", function () {
        var result = fuzzer.fuzz();
        for (
            var _i = 0, _a = __spreadArray([testConfig2.password], testConfig2.fuzzed, true);
            _i < _a.length;
            _i++
        ) {
            var res = _a[_i];
            (0, vitest_1.expect)(result).toContain(res);
        }
    });
    (0, vitest_1.test)("Compine", function () {
        var result = fuzzer["compinePassowords"]([]);
        (0, vitest_1.expect)(result).toStrictEqual([]);
        result = fuzzer["compinePassowords"]([
            ["a", "b"],
            ["c", "d"],
        ]);
        (0, vitest_1.expect)(result).toStrictEqual(["ac", "ad", "bc", "bd"]);
        result = fuzzer["compinePassowords"]([
            ["1", "2"],
            ["pass", "Pass"],
            ["$", "-"],
        ]);
        (0, vitest_1.expect)(result).toStrictEqual([
            "1pass$",
            "1pass-",
            "1Pass$",
            "1Pass-",
            "2pass$",
            "2pass-",
            "2Pass$",
            "2Pass-",
        ]);
    });
});
