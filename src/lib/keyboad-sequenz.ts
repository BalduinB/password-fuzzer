import { QWERTY_KEYBOARD } from "./config";
type DirOffsets = 0 | 1 | -1;
export function keyboardSequenzDirection(str: string) {
    const keyboardIndexes = keyboardIndexesFromStr(str);

    let direction = null as { colOff: DirOffsets; rowOff: DirOffsets } | null;
    let invalid = false;
    let i = 0;
    for (const current of keyboardIndexes) {
        if (!current) {
            invalid = true;
            break;
        }
        if (i === keyboardIndexes.length - 1) continue;
        const next = keyboardIndexes[i + 1];
        i++;
        if (!next) {
            invalid = true;
            break;
        }
        if (!direction) {
            let found = false;
            for (const currDir of DIRS) {
                const matchingCol = next.colI === current.colI + currDir.colOff;
                const matchingRow = next.rowI === current.rowI + currDir.rowOff;
                if (matchingCol && matchingRow) {
                    direction = currDir;
                    found = true;
                    break;
                }
            }
            if (!found) {
                invalid = true;
                break;
            }
            continue;
        }

        const matchingCol = next.colI === current.colI + direction.colOff;
        const matchingRow = next.rowI === current.rowI + direction.rowOff;

        if (!matchingCol || !matchingRow) {
            invalid = true;
            break;
        }
    }
    return invalid ? null : direction;
}

export function fuzzKeyboardSquenz(str: string, keyboad = QWERTY_KEYBOARD, offset = 2) {
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

const DIRS: Array<{ colOff: DirOffsets; rowOff: DirOffsets }> = [
    { colOff: -1, rowOff: 0 },
    { colOff: 1, rowOff: 0 },
    { colOff: 0, rowOff: -1 },
    { colOff: 0, rowOff: 1 },
];

function maxKeyBoardRowLength(kb: Array<Array<string>>) {
    return kb.reduce((max, row) => (row.length > max ? row.length : max), 0);
}
function maxKeyBoardColLength(kb: Array<Array<string>>) {
    return kb.length;
}
