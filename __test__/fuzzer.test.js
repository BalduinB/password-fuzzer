"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var password_1 = require("@/password");
var fuzzer_1 = require("@/fuzzer");
var index_1 = require("@/index");
var testConfig = {
    password: "Password123%",
    mask: "ULLLLLLLNNNS",
    class: "ULNS",
    elements: ["P", "assword", "123", "%"],
};
var fuzzer = new fuzzer_1.Fuzzer();
(0, vitest_1.describe)("Password", function () {
    (0, vitest_1.test)("Creation", function () {
        (0, vitest_1.expect)(fuzzer).toBeDefined();
    });
    (0, vitest_1.test)("Register", function () {
        fuzzer.register(new index_1.TDTMethod(new password_1.Password(testConfig.password)));
        (0, vitest_1.expect)(fuzzer["methods"].length).eq(1);
    });
});
