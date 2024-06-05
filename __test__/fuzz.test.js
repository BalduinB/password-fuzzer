"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("@/index");
var vitest_1 = require("vitest");
var testConfig = {
    password: "Password1",
    fuzzed: [
        "Password1",
        "1Password",
        "PASSWORD",
        "Password",
        "PassworD",
        "P@ssword",
        "Passw0rd",
        "Pas$word",
        "Password12",
        "Password123",
        "Password1234",
        "Password2",
        "Password3",
        "Password4",
        "password12",
        "password123",
        "password1234",
        "password2",
        "password3",
        "password4",
    ],
};
(0, vitest_1.describe)("fuzz abstraction", function () {
    var res = (0, index_1.fuzz)(testConfig.password);
    (0, vitest_1.test)("defined", function () {
        (0, vitest_1.expect)(res).toBeDefined();
    });
    (0, vitest_1.test)("length", function () {
        console.log("Amount: ".concat(res.length));
        (0, vitest_1.expect)(res.length).toBeGreaterThan(1);
    });
    (0, vitest_1.test)("contains", function () {
        for (var _i = 0, _a = testConfig.fuzzed; _i < _a.length; _i++) {
            var results = _a[_i];
            (0, vitest_1.expect)(res).toContain(results);
        }
    });
    (0, vitest_1.test)("handle many passwort elements", function () {
        (0, index_1.fuzz)("informatik12sich54-:erheit");
    });
});
