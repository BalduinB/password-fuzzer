export function keyboardSequenzDirection(str: string) {
    const keyboardIndexes = keyboardIndexesFromStr(str);

    let direction = null as [number, number] | null;
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
                const [rowOffset, colOffset] = currDir;
                const matchingCol = next.colI === current.colI + colOffset;
                const matchingRow = next.rowI === current.rowI + rowOffset;
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

        const [rowOffset, colOffset] = direction;
        const matchingCol = next.colI === current.colI + colOffset;
        const matchingRow = next.rowI === current.rowI + rowOffset;

        if (!matchingCol || !matchingRow) {
            invalid = true;
            break;
        }
    }
    return invalid ? null : direction;
}

export function fuzzKeyboardSquenz(str: string, offset = 2) {
    const keyboardIndexes = keyboardIndexesFromStr(str);
    const dirOfSequenz = keyboardSequenzDirection(str);

    if (!dirOfSequenz) return [];
    const [rowOffset, colOffset] = dirOfSequenz;

    const fuzzDir: "row" | "col" = rowOffset === 0 ? "row" : "col";
    const fuzzColIdxMultipl = fuzzDir === "col" ? 1 : 0;
    const fuzzRowIdxMultipl = fuzzDir === "row" ? 1 : 0;

    const results: Array<string> = [];
    for (let index = 1; index <= offset; index++) {
        const result = keyboardIndexes
            .map((indexes) => {
                if (!indexes) return null;
                const colIdx = indexes.colI + fuzzColIdxMultipl * index;
                const rowIdx = indexes.rowI + fuzzRowIdxMultipl * index;
                return QWERTZ_KEYBOARD[rowIdx]?.[colIdx];
            })
            .join("");
        results.push(result);
    }

    return results;
}

const QWERTZ_KEYBOARD = [
    "1234567890ß".split(""),
    "qwertzuiopü".split(""),
    "asdfghjklöä".split(""),
    "yxcvbnm,.-".split(""),
];

function keyboardIndexesFromStr(str: string) {
    return str
        .toLowerCase()
        .split("")
        .map((char) => {
            const rowI = QWERTZ_KEYBOARD.findIndex((row) => row.includes(char));
            const colI = QWERTZ_KEYBOARD[rowI]?.indexOf(char);
            if (rowI === -1 || colI === undefined || colI === -1) return null;
            return { rowI, colI };
        });
}

const DIRS: Array<[number, number]> = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];
