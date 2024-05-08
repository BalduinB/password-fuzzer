import { title } from "process";
import { basePathOfBreachData, getLineCountOfFile, parseOutLines, walkWhile } from "./fs";
import { fNumber } from "./helpers/formaters";

const NUMBER_OF_ENTRIES = 2_540_774_106;
export const SAMPLE_SIZE = 50_000;

export function getRandomPairsFromFS(amount: number) {
    const randomIds = getRandomIds(amount);
    return findLines(randomIds);
}
/**
 *
 * @param lineIndexes zero based indexes of lines to find
 * @returns Array of { email, password }
 */
function findLines(lineIndexes: Array<number>) {
    const linesToFind = lineIndexes.toSorted();
    let passedLines = 0;
    let filesPassed = 0;
    let skippedLines = 0;
    const results: Array<{ email: string; password: string }> = [];
    const maxLineNumber = lineIndexes.reduce((max, curr) => (curr > max ? curr : max), 0);
    walkWhile(
        basePathOfBreachData,
        () => linesToFind.length > results.length + skippedLines && passedLines < maxLineNumber,
        (content) => {
            filesPassed++;
            const lineCount = getLineCountOfFile(content);

            const linesIndexesInFile = linesToFind
                .filter(
                    (lineIndex) =>
                        lineIndex > passedLines - 1 && lineIndex < lineCount + passedLines,
                )
                .map((lineIndex) => Math.max(0, lineIndex - passedLines - 1));

            const foundLines = parseOutLines(content, linesIndexesInFile);
            for (const { email, password } of foundLines) {
                //TODO: dashier zieht übertriegen viel Memory, aber nur wenn die echten Daten genommen werden.
                const newEmail = email;
                const newPassword = password;
                console.log("FOUND", newEmail, newPassword);
                results.push({
                    email: `eineSehrLangeEmailAdresse${Math.random() * 200}@gmx.com`,
                    password: `adkjfsdkfjskdajfksdlfsa${Math.random() * 200}djfsalkdfjaslkdfjsdklfjslk`,
                });
            }
            passedLines += lineCount;
            skippedLines += linesIndexesInFile.length - foundLines.length;
            if (filesPassed % 100 === 0) {
                console.table([
                    {
                        title: "WALKING",
                        passedLines: fNumber(passedLines),
                        maxLineNumber: fNumber(maxLineNumber),
                        linesIndexesInFile: fNumber(linesIndexesInFile.length),
                        results: fNumber(results.length),
                        file: `${filesPassed}/4_800`,
                    },
                ]);
            }
        },
    );
    if (results.length !== lineIndexes.length) {
        console.log("MISSING LINES", lineIndexes.length, results.length);
    }
    return results;
}

const MAX_LINE_IDS = 1_000;
function getRandomIds(amount: number) {
    return Array.from(
        new Set(
            Array.from({ length: Math.min(MAX_LINE_IDS, amount) }, () =>
                Math.round(Math.random() * NUMBER_OF_ENTRIES),
            ),
        ),
    );
}
