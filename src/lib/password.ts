import {
    uppercase,
    lowercase,
    numbers,
    symbols,
    CharGroup,
    getGroupMask,
} from "./config";

export function isUpperCase(char: string) {
    return uppercase.includes(char);
}

export function isLowerCase(char: string) {
    return lowercase.includes(char);
}

export function isNumber(char: string) {
    return numbers.includes(char);
}

export function isSymbol(char: string) {
    return symbols.includes(char);
}
export function calculateMask(pw: string) {
    let mask = "";
    for (const char of pw) {
        let group: CharGroup;
        if (isUpperCase(char)) group = "uppercase";
        else if (isLowerCase(char)) group = "lowercase";
        else if (isNumber(char)) group = "numbers";
        else if (isSymbol(char)) group = "symbols";
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
