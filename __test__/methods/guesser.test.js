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
var guesser_1 = require("@/fuzzers/guesser");
var testConfig = {
    password: "password123",
    fuzzed: [
        "password12",
        "1password",
        "PASSWORD",
        "Password",
        "passworD",
        "p@ssword",
        "passw0rd",
        "pas$word",
    ],
};
var fuzzer = new guesser_1.GuesserMethod(new password_1.Password(testConfig.password));
(0, vitest_1.describe)("Guesser Model", function () {
    (0, vitest_1.test)("Creation", function () {
        (0, vitest_1.expect)(fuzzer).toBeDefined();
    });
    (0, vitest_1.test)("Fuzz", function () {
        var result = fuzzer.fuzz();
        console.log("Amount:".concat(result.length));
        for (
            var _i = 0, _a = __spreadArray([testConfig.password], testConfig.fuzzed, true);
            _i < _a.length;
            _i++
        ) {
            var res = _a[_i];
            (0, vitest_1.expect)(result).toContain(res);
        }
    });
});
