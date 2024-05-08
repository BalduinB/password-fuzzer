import { basePathOfBreachData, getLineCountOfFile, getLinesOfFile, walkWhile } from "./fs";
import { isEmail } from "./helpers/validator";

const NUMBER_OF_ENTRIES = 2_540_774_106;
export const SAMPLE_SIZE = 400;
export async function getRandomPairsFromFS(amount: number) {
    const randomIds = getRandomIds(amount);
    return await findLines(randomIds);
}
/**
 *
 * @param lineIndexes zero based indexes of lines to find
 * @returns Array of { email, password }
 */
async function findLines(lineIndexes: Array<number>) {
    let linesToFind = lineIndexes.toSorted();
    let passedLines = 0;
    const results: Array<{ email: string; password: string }> = [];

    await walkWhile(
        basePathOfBreachData,
        () => !!linesToFind.length,
        async (content) => {
            const lineCount = getLineCountOfFile(content);

            const linesInFile = linesToFind.filter(
                (lineIndex) => lineIndex > passedLines - 1 && lineIndex < lineCount + passedLines,
            );
            // console.log(
            //     "WALKING",
            //     passedLines,
            //     linesToFind.length,
            //     results.length,
            //     linesInFile.length,
            // );
            let lines: Array<string> = [];
            let missingLines = false;
            if (!!linesInFile.length) {
                lines = getLinesOfFile(content);
            }
            for (const lineIndex of linesInFile) {
                const lineIndexInFile = Math.max(0, lineIndex - passedLines - 1); // Fix first line, where lineIndex = 0 and passedLines = 0
                const [email, password] = getLineContent(lines, lineIndexInFile);
                if (!email || !password || !isEmail(email)) {
                    // Scan next lines for valid data
                    let nextLine = lineIndexInFile + 1;

                    while (nextLine < lineCount) {
                        const [email, password] = getLineContent(lines, nextLine);
                        if (!email || !password || !isEmail(email)) {
                            nextLine++;
                            continue;
                        }
                        // console.log("FOUND", email, password, nextLine, lineIndexInFile);
                        results.push({ email, password });
                        break;
                    }
                    if (nextLine === lineCount) {
                        // console.log("MISSING", lineIndex, lineIndexInFile, email);
                        missingLines = true;
                    }
                } else {
                    // console.log("FOUND", lineIndex, lineIndexInFile, email);
                    results.push({ email, password });
                }
            }
            if (missingLines) {
                linesToFind = Array.from(
                    new Set(
                        linesToFind.map((lineIndex) =>
                            lineIndex < passedLines + lineCount
                                ? passedLines + lineCount
                                : lineIndex,
                        ),
                    ),
                );
            }
            // @ts-expect-error - Reset lines for GC
            lines = undefined;
            passedLines += lineCount;
        },
    );
    if (results.length !== lineIndexes.length) {
        console.log("MISSING LINES", lineIndexes.length, results.length);
    }
    return results;
}

function parseOutLines(content: string, lineIndexes: Array<number>) {
    const lines = getLinesOfFile(content);
    return lineIndexes.map((lineIndex) => {
        const [email, password] = getLineContent(lines, lineIndex);
        return { email, password };
    });
}

function getLineContent(lines: Array<string>, lineIndex: number) {
    const line = lines[lineIndex]?.split(":");
    if (!line) throw new Error("Line not found");
    return line;
}
const MAX_LINE_IDS = 400;
function getRandomIds(amount: number) {
    return Array.from(
        new Set(
            Array.from({ length: Math.min(MAX_LINE_IDS, amount) }, () =>
                Math.round(Math.random() * NUMBER_OF_ENTRIES),
            ),
        ),
    );
}
