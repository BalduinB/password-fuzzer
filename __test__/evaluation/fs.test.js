"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("@/evaluation/fs");
var vitest_1 = require("vitest");
(0, vitest_1.describe)("fs functions", function () {
    (0, vitest_1.test)("Parse out Lines", function () {
        var firstLine = (0, fs_1.parseOutLines)("emailFIRST@domain.com:password".concat(fs_1.lineDelimiter, "email2@domain.com:password"), [0]);
        (0, vitest_1.expect)(firstLine).toEqual([{ email: "emailFIRST@domain.com", password: "password" }]);
        var secondLine = (0, fs_1.parseOutLines)("email@domain.com:password".concat(fs_1.lineDelimiter, "email2@domain.com:password"), [1]);
        (0, vitest_1.expect)(secondLine).toEqual([{ email: "email2@domain.com", password: "password" }]);
        var middleLine = (0, fs_1.parseOutLines)("email@domain.com:password".concat(fs_1.lineDelimiter, "emailMIDDLE@domain.com:password").concat(fs_1.lineDelimiter, "email3@domain.com:password"), [1]);
        (0, vitest_1.expect)(middleLine).toEqual([{ email: "emailMIDDLE@domain.com", password: "password" }]);
    });
});
