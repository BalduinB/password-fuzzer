import { numbers, symbols, CharGroup, getGroupMask, MAX_LENGTH, MIN_LENGTH } from "./config";

export function isUpperCase(char: string) {
    return char.toUpperCase() === char && char.toLowerCase() !== char;
}

export function isLowerCase(char: string) {
    return char.toLowerCase() === char && char.toUpperCase() !== char;
}

export function isNumberChar(char: string) {
    return numbers.includes(char);
}
export function isNumberStr(str: string) {
    return !isNaN(Number(str));
}

export function isSymbolChar(char: string) {
    return symbols.includes(char);
}

export function isSymbolStr(str: string) {
    return str.split("").every((char) => symbols.includes(char));
}

export function calculateMask(pw: string) {
    let mask = "";
    for (const char of pw) {
        let group: CharGroup;
        if (isUpperCase(char)) group = "uppercase";
        else if (isLowerCase(char)) group = "lowercase";
        else if (isNumberChar(char)) group = "numbers";
        else if (isSymbolChar(char)) group = "symbols";
        else group = "unknown";
        mask += getGroupMask(group);
    }
    return mask;
}

export function calculateClass(pw: string) {
    const mask = calculateMask(pw);
    let cls = "";
    for (const char of mask) {
        const lastChar = cls.slice(-1);
        if (char === lastChar) {
            continue;
        }
        cls += char;
    }
    return cls;
}
export function calculateElements(pw: string) {
    const mask = calculateMask(pw);
    const elements = mask.split("").reduce((acc, currMask, idx) => {
        const prevMask = mask[idx - 1];
        if (idx === 0) {
            acc.push(pw[idx] ?? "");
        } else if (currMask === prevMask) {
            acc[acc.length - 1] += pw[idx];
        } else acc.push(pw[idx] ?? "");
        return acc;
    }, [] as Array<string>);

    return elements;
}
const alphaStringMasks: Array<string> = [getGroupMask("uppercase"), getGroupMask("lowercase")];

export function calculateElementsWithAlpha(pw: string) {
    const mask = calculateMask(pw);
    const elements = mask.split("").reduce((acc, currMask, idx) => {
        const prevMask = mask[idx - 1];
        if (!prevMask) {
            acc.push(pw[idx] ?? "");
        } else if (
            currMask === prevMask ||
            (alphaStringMasks.includes(currMask) && alphaStringMasks.includes(prevMask))
        ) {
            acc[acc.length - 1] += pw[idx];
        } else acc.push(pw[idx] ?? "");
        return acc;
    }, [] as Array<string>);

    return elements;
}

export function isTooLong(pw: string) {
    return pw.length > MAX_LENGTH;
}
export function isTooShort(pw: string) {
    return pw.length < MIN_LENGTH;
}
