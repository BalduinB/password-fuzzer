import * as fs from "fs";
import * as path from "path";
import { isEmail } from "./helpers/validator";

export const basePathOfBreachData = path.join(__dirname, "../CompilationOfManyBreaches/data");
export const lineDelimiter = "\r\n";

export function parseOutLines(content: string, lineIndexes: Array<number>) {
    const results: Array<{ email: string; password: string }> = [];

    if (lineIndexes.length === 0) return results;
    const lines = getLinesOfFile(content);
    for (const lineIndex of lineIndexes) {
        const [email, password] = getLineContent(lines, lineIndex);
        if (!email || !password || !isEmail(email)) {
            continue;
        }
        results.push({ email, password });
    }
    // NOTE: not shure what is faster.
    //  const delimiterOffset = lineDelimiter.length;
    //  let pos = 0;
    //  let currentLineIndex = 0;
    // const maxLineNumber = lineIndexes.reduce((max, curr) => (curr > max ? curr : max), 0);
    // while (pos > -1 && currentLineIndex < maxLineNumber) {
    //     if (lineIndexes.includes(currentLineIndex)) {
    //         let lineEnd = content.indexOf(lineDelimiter, pos + delimiterOffset);
    //         if (lineEnd === -1) {
    //             lineEnd = content.length;
    //         }
    //         const lineStart = pos === 0 ? 0 : pos + delimiterOffset;

    //         const line = content.slice(lineStart, lineEnd);
    //         const [email, password] = parseLine(line);
    //         if (!email || !password || !isEmail(email)) {
    //             pos = content.indexOf(lineDelimiter, currentLineIndex);
    //             currentLineIndex++;
    //             continue;
    //         }
    //         // console.log("FOUND", lineIndex, lineIndexInFile, email);
    //         results.push({ email, password });
    //     }

    //     pos = content.indexOf(lineDelimiter, currentLineIndex);
    //     currentLineIndex++;
    // }

    return results;
}

export function getLineCountOfFile(fileContent: string) {
    let lineCount = 0;
    const step = lineDelimiter.length;
    let pos = 0;

    while (pos > -1) {
        pos = fileContent.indexOf(lineDelimiter, pos);
        if (pos >= 0) {
            ++lineCount;
            pos += step;
        } else break;
    }
    return lineCount;
}

export function getLinesOfFile(fileContent: string) {
    return fileContent.split(lineDelimiter).filter(Boolean);
}

export function getLineContent(lines: Array<string>, lineIndex: number) {
    const line = lines[lineIndex]?.split(":");
    if (!line) throw new Error("Line not found");
    return line;
}

export function parseLine(line: string) {
    return line.split(":");
}

export function readDir(path: string) {
    return fs.readdirSync(path);
}

export function readFile(filePath: string) {
    return fs.readFileSync(filePath, { encoding: "utf8" });
}
export function walkWhile(
    basePath: string,
    takeNext: () => boolean,
    onIsFile: (content: string) => void,
) {
    const files = readDir(basePath); // Dont check takeNext, readDir is not that heavy.
    for (const file of files) {
        if (!takeNext()) return; // Stop walking if we want to cancel File scanning.
        const filePath = path.join(basePath, file);
        const fileStats = fs.lstatSync(filePath);
        if (fileStats.isFile() && file !== ".DS_Store") {
            // console.log("READING FILE", filePath.slice(basePathOfBreachData.length + 1));

            onIsFile(readFile(filePath));
        } else if (fileStats.isDirectory()) {
            walkWhile(filePath, takeNext, onIsFile);
        } else console.log("Unknown file type: " + filePath);
    }
}
3_002_859_753;
