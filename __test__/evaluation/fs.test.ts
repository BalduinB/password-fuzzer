import { lineDelimiter, parseOutLines } from "@/evaluation/fs";
import { describe, expect, test } from "vitest";

describe("fs functions", () => {
    test("Parse out Lines", () => {
        const firstLine = parseOutLines(
            `emailFIRST@domain.com:password${lineDelimiter}email2@domain.com:password`,
            [0],
        );
        expect(firstLine).toEqual([{ email: "emailFIRST@domain.com", password: "password" }]);
        const secondLine = parseOutLines(
            `email@domain.com:password${lineDelimiter}email2@domain.com:password`,
            [1],
        );
        expect(secondLine).toEqual([{ email: "email2@domain.com", password: "password" }]);

        const middleLine = parseOutLines(
            `email@domain.com:password${lineDelimiter}emailMIDDLE@domain.com:password${lineDelimiter}email3@domain.com:password`,
            [1],
        );
        expect(middleLine).toEqual([{ email: "emailMIDDLE@domain.com", password: "password" }]);
    });
});
