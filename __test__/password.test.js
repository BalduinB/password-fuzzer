"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var password_1 = require("@/password");
var testConfig = {
    password: "Password123%",
    mask: "ULLLLLLLNNNS",
    class: "ULNS",
    elements: ["P", "assword", "123", "%"],
};
var pw = new password_1.Password(testConfig.password);
(0, vitest_1.describe)("Password", function () {
    (0, vitest_1.test)("Creation", function () {
        (0, vitest_1.expect)(pw).toBeDefined();
    });
    (0, vitest_1.test)("Mask", function () {
        (0, vitest_1.expect)(pw.getMask()).toEqual(testConfig.mask);
    });
    (0, vitest_1.test)("Class", function () {
        (0, vitest_1.expect)(pw.getClass()).toEqual(testConfig.class);
    });
    (0, vitest_1.test)("Elements", function () {
        var elements = pw.getElements();
        (0, vitest_1.expect)(elements).toEqual(testConfig.elements);
    });
    (0, vitest_1.test)("hasNumbers", function () {
        // const elements = pw.hasNumbers();
        (0, vitest_1.expect)(pw.hasNumbers()).toEqual(true);
    });
});
