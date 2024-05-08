import { basePathOfBreachData, getLinesOfFile, walkWhile } from "./fs";
import { isEmail } from "./helpers/validator";

const NUMBER_OF_ENTRIES = 2_540_774_106;

export function getRandomPairsFromFS() {
    const randomIds = getRandomIds();
    return findLines(randomIds);
}
/**
 *
 * @param lineIndexes zero based indexes of lines to find
 * @returns Array of { email, password }
 */
function findLines(lineIndexes: Array<number>) {
    let linesToFind = lineIndexes.toSorted();
    let passedLines = 0;
    const results: Array<{ email: string; password: string }> = [];

    walkWhile(
        basePathOfBreachData,
        () => !!linesToFind.length,
        (content) => {
            const lines = getLinesOfFile(content);
            const lineCount = lines.length;

            const linesInFile = linesToFind.filter(
                (lineIndex) => lineIndex > passedLines - 1 && lineIndex < lineCount + passedLines,
            );
            console.log(
                "WALKING",
                passedLines,
                linesToFind.length,
                results.length,
                linesInFile.length,
            );
            let missingLines = true;
            for (const lineIndex of linesInFile) {
                const lineIndexInFile = Math.max(0, lineIndex - passedLines - 1); // Fix first line, where lineIndex = 0
                const [email, password] = getLineContent(lines, lineIndexInFile);
                if (!email || !password || !isEmail.safeParse(email).success) {
                    // Scan next lines for valid data
                    let nextLine = lineIndexInFile + 1;
                    while (nextLine < lineCount) {
                        console.log("schieben");
                        const [email, password] = getLineContent(lines, nextLine);
                        if (!email || !password || !isEmail.safeParse(email).success) {
                            missingLines = true;
                            nextLine++;
                            continue;
                        }
                        missingLines = false;
                        // console.log("FOUND", email, password, nextLine);
                        linesToFind = linesToFind.filter((line) => line !== lineIndex);
                        results.push({ email, password });
                        break;
                    }
                } else {
                    // console.log("FOUND", email, password, lineIndex);
                    linesToFind = linesToFind.filter((line) => line !== lineIndex);
                    results.push({ email, password });
                }
            }
            if (missingLines && linesInFile.length > 0) {
                linesToFind = linesToFind.map((lineIndex) =>
                    lineIndex < passedLines + lineCount ? passedLines + lineCount : lineIndex,
                );
            }

            passedLines += lineCount;
        },
    );
    return results;
}

function getLineContent(lines: Array<string>, lineIndex: number) {
    const line = lines[lineIndex]?.split(":");
    if (!line) new Error("Line not found");
    return line;
}

function getRandomIds(amount = 400) {
    return Array.from(
        new Set(
            Array.from({ length: amount }, () => Math.round(Math.random() * NUMBER_OF_ENTRIES)),
        ),
    );
}
