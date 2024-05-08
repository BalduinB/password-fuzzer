import { wait } from "@/lib/wait";
import * as fs from "fs";
import * as path from "path";

export const basePathOfBreachData = path.join(__dirname, "../CompilationOfManyBreaches/data");
export const lineDelimiter = "\r\n";

export function getLinesOfFile(fileContent: string) {
    return fileContent.split(lineDelimiter).filter(Boolean);
}

export function getLineCountOfFile(fileContent: string) {
    let lineCount = 0;
    const step = lineDelimiter.length;
    let pos = 0;

    while (true) {
        pos = fileContent.indexOf(lineDelimiter, pos);
        if (pos >= 0) {
            ++lineCount;
            pos += step;
        } else break;
    }
    return lineCount;
}
export function readDir(path: string) {
    return fs.readdirSync(path);
}

export function readFile(filePath: string) {
    return fs.readFileSync(filePath, { encoding: "utf8" });
}
export async function walkWhile(
    basePath: string,
    takeNext: () => boolean,
    onIsFile: (content: string) => Promise<void>,
) {
    const files = readDir(basePath); // Dont check takeNext, readDir is not that heavy.
    await wait(2000); // trigger GC to prevent memory leak
    for (const file of files) {
        if (!takeNext()) return; // Stop walking if we want to cancel File scanning.
        const filePath = path.join(basePath, file);
        const fileStats = fs.lstatSync(filePath);
        if (fileStats.isFile() && file !== ".DS_Store") {
            const currentFile = filePath.slice(basePathOfBreachData.length + 1);
            console.log("READING FILE", currentFile);

            await onIsFile(readFile(filePath));
        } else if (fileStats.isDirectory()) {
            await walkWhile(filePath, takeNext, onIsFile);
        } else console.log("Unknown file type: " + filePath);
    }
}
3_002_859_753;
