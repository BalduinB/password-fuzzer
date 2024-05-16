import { QWERTY_KEYBOARD } from "./config";
type DirOffsets = 0 | 1 | -1;
type Direction = { colOff: DirOffsets; rowOff: DirOffsets };

export function findKeyboardSequenzes(str: string, keyboad = QWERTY_KEYBOARD) {
    const keyboardIndexes = keyboardIndexesFromStr(str, keyboad);
    const kbSequenzes: Array<string> = [];
    let currentDirection: Direction | null = null;
    let currentString = "";
    let i = -1;
    for (const current of keyboardIndexes) {
        i++;
        // Char not on keyboard -> reset and check current progress
        if (!current) {
            if (currentString.length > 1) kbSequenzes.push(currentString);
            currentString = "";
            continue;
        }

        const prev = keyboardIndexes[i - 1];
        // // First char after reset or first char -> start new sequence
        if (!prev) {
            if (currentString.length > 1) kbSequenzes.push(currentString);
            currentString += str[i];
            continue;
        }
        // Second char -> get direction
        if (!currentDirection) {
            const dir = getDir(prev, current);
            // Not a valid direction -> reset and set first char
            if (!dir) {
                currentString = str[i] ?? "";
                continue;
            }
            // Set direction and add second char
            currentDirection = dir;
            currentString += str[i];
            continue;
        }
        const matchingCol = current.colI === prev.colI + currentDirection.colOff;
        const matchingRow = current.rowI === prev.rowI + currentDirection.rowOff;

        // nth char not matching -> reset and check current progress
        if (!matchingCol || !matchingRow) {
            if (currentString.length > 1) kbSequenzes.push(currentString);
            currentString = str[i] ?? "";
            currentDirection = null;
            continue;
        }
        // nth char matching -> add to sequence
        currentString += str[i];
    }
    // Check last sequence
    if (currentString.length > 1) kbSequenzes.push(currentString);
    return kbSequenzes;
}
export function fuzzKeyboardSquenz(str: string, keyboad = QWERTY_KEYBOARD, offset = 2) {
    if (str.length < 2) return [];
    const keyboardIndexes = keyboardIndexesFromStr(str, keyboad);
    const dirOfSequenz = keyboardSequenzDirection(str);
    if (!dirOfSequenz) return [];

    const fuzzDir: "row" | "col" = dirOfSequenz.rowOff === 0 ? "row" : "col";
    const fuzzColIdxMultipl = fuzzDir === "col" ? 1 : 0;
    const fuzzRowIdxMultipl = fuzzDir === "row" ? 1 : 0;

    const results: Array<string> = [];
    const maxColLength = maxKeyBoardRowLength(keyboad);
    const maxRowLength = maxKeyBoardColLength(keyboad);
    function clampRowIdx(rowIdx: number) {
        if (rowIdx < 0) rowIdx = maxRowLength + rowIdx;
        return rowIdx % maxRowLength;
    }
    function clampColIdx(colIdx: number) {
        if (colIdx < 0) colIdx = maxColLength + colIdx;
        return colIdx % maxColLength;
    }
    if (keyboardIndexes.includes(null)) return results;
    for (let index = -offset; index <= offset; index++) {
        if (index === 0) continue;

        const result = keyboardIndexes.map((indexes) => {
            //should not happen, because we already checked for null
            if (!indexes) return null;

            let colIdx = indexes.colI + fuzzColIdxMultipl * index;
            let rowIdx = indexes.rowI + fuzzRowIdxMultipl * index;
            colIdx = clampColIdx(colIdx);
            rowIdx = clampRowIdx(rowIdx);

            return keyboad[rowIdx]?.[colIdx];
        });
        if (result.includes(null) || result.includes(undefined)) continue;
        results.push(result.join(""));
    }

    return Array.from(new Set(results));
}

function keyboardIndexesFromStr(str: string, keyboad = QWERTY_KEYBOARD) {
    return str
        .toLowerCase()
        .split("")
        .map((char) => {
            const rowI = keyboad.findIndex((row) => row.includes(char));
            const colI = keyboad[rowI]?.indexOf(char);
            if (rowI === -1 || colI === undefined || colI === -1) return null;
            return { rowI, colI };
        });
}
export function keyboardSequenzDirection(str: string) {
    const keyboardIndexes = keyboardIndexesFromStr(str);

    let direction: Direction | null = null;

    let i = 0;
    for (const current of keyboardIndexes) {
        if (!current) return null;
        if (i === keyboardIndexes.length - 1) continue;

        const next = keyboardIndexes[i + 1];
        if (!next) return null;
        i++;

        if (!direction) {
            const dir = getDir(current, next);
            if (!dir) return null;
            direction = dir;
            continue;
        }

        const matchingCol = next.colI === current.colI + direction.colOff;
        const matchingRow = next.rowI === current.rowI + direction.rowOff;

        if (!matchingCol || !matchingRow) {
            return null;
        }
    }
    return direction;
}
const DIRS: Array<Direction> = [
    { colOff: -1, rowOff: 0 },
    { colOff: 1, rowOff: 0 },
    { colOff: 0, rowOff: -1 },
    { colOff: 0, rowOff: 1 },
];

function getDir(current: { rowI: number; colI: number }, next: { rowI: number; colI: number }) {
    for (const currDir of DIRS) {
        const matchingCol = next.colI === current.colI + currDir.colOff;
        const matchingRow = next.rowI === current.rowI + currDir.rowOff;

        if (matchingCol && matchingRow) return currDir;
    }
}
function maxKeyBoardRowLength(kb: Array<Array<string>>) {
    return kb.reduce((max, row) => (row.length > max ? row.length : max), 0);
}
function maxKeyBoardColLength(kb: Array<Array<string>>) {
    return kb.length;
}
