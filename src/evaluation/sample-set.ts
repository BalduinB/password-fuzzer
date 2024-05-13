import { db } from "./db/client";
import { basePathOfBreachData, getLineCountOfFile, parseOutLines, walkWhile } from "./fs";
import { eq } from "drizzle-orm";
import { fNumber } from "./helpers/formaters";
import { analysedDataTest } from "./db/schema";
import { alreadyExists } from "./db/analysed-data";

const NUMBER_OF_ENTRIES = 3_279_064_311;
export const SAMPLE_SIZE = 40_000;

export async function getRandomPairsFromFS(amount: number) {
    const randomIds = getRandomIds(amount);
    const lines = await findLines(randomIds);
    return await filterAlreadyInSampleSet(lines);
}

export async function filterAlreadyInSampleSet(lines: Array<{ email: string; password: string }>) {
    const results = [];
    const batchSize = 250;
    for (let i = 0; i < lines.length; i += batchSize) {
        const batch = lines.slice(i, i + batchSize);
        const shouldInclude = await Promise.all(
            batch.map(async ({ email, password }) => !(await alreadyExists(email, password))),
        );
        results.push(...batch.filter((_, i) => !shouldInclude[i]));
    }

    return results;
}
/**
 *
 * @param lineIndexes zero based indexes of lines to find
 * @returns Array of { email, password }
 */
async function findLines(lineIndexes: Array<number>) {
    const linesToFind = lineIndexes.toSorted();
    let passedLines = 0;
    let filesPassed = 0;
    let skippedLines = 0;
    const results: Array<{ email: string; password: string }> = [];
    const maxLineNumber = lineIndexes.reduce((max, curr) => (curr > max ? curr : max), 0);
    await walkWhile(
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
                // deep copy event though it's not necessary, weird memory usage if not done
                const newEmail = JSON.parse(JSON.stringify(email));
                const newPassword = JSON.parse(JSON.stringify(password));
                results.push({
                    email: newEmail,
                    password: newPassword,
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
                        lotalLinesToFind: fNumber(lineIndexes.length),
                        results: fNumber(results.length),
                        skipped: fNumber(skippedLines),
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

const MAX_LINE_IDS = 20_000;
function getRandomIds(amount: number) {
    return Array.from(
        new Set(
            Array.from({ length: Math.min(MAX_LINE_IDS, amount) }, () =>
                Math.round(Math.random() * NUMBER_OF_ENTRIES),
            ),
        ),
    );
}

export async function getDummyFromDB() {
    return await db
        .select({
            password: analysedDataTest.pw,
            email: analysedDataTest.email,
        })
        .from(analysedDataTest)
        .where(eq(analysedDataTest.pwType, "base"))
        .limit(SAMPLE_SIZE);
}
