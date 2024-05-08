import * as fs from "fs";
import * as path from "path";

export const basePathOfBreachData = path.join(__dirname, "../CompilationOfManyBreaches/data");
export const lineDelimiter = "\r\n";

export function getLinesOfFile(fileContent: string) {
    return fileContent.split(lineDelimiter).filter(Boolean);
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
            console.log("READING FILE", filePath.slice(basePathOfBreachData.length + 1));
            onIsFile(readFile(filePath));
        } else if (fileStats.isDirectory()) {
            walkWhile(filePath, takeNext, onIsFile);
        } else console.log("Unknown file type: " + filePath);
    }
}
3_002_859_753;
