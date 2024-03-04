export const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const lowercase = "abcdefghijklmnopqrstuvwxyz";
export const numbers = "0123456789";
export const symbols = "∼ `!@#$% ∧ &*()−+=[]{}|;’:',./<>?";

const CHAR_GROUP_TO_MASK = {
    uppercase: "U",
    lowercase: "L",
    numbers: "N",
    symbols: "S",
    unknown: "X",
} as const;

export type CharGroup = keyof typeof CHAR_GROUP_TO_MASK;
export type CharGroupMask = (typeof CHAR_GROUP_TO_MASK)[CharGroup];

export function getGroupMask(group: CharGroup) {
    return CHAR_GROUP_TO_MASK[group];
}

export const MIN_LENGTH = 6;
export const MAX_LENGTH = 11;

export const LEET_MAP: Record<string, Array<string>> = {
    o: ["0"],
    a: ["4", "@"],
    s: ["$"],
    i: ["1"],
    e: ["3"],
    t: ["7"],
};

export function isLeetalble(c: string) {
    c = c.toLowerCase();
    return c in LEET_MAP || Object.values(LEET_MAP).some((v) => v.includes(c));
}
export function getLeetedChars(char: string) {
    char = char.toLowerCase();

    const leetChars = LEET_MAP[char];
    if (leetChars) return leetChars;

    return Object.entries(LEET_MAP).reduce((possibleReplacements, [k, v]) => {
        if (v.includes(char)) possibleReplacements.push(k);
        return possibleReplacements;
    }, [] as Array<string>);
}

export const QWERTZ_KEYBOARD = [
    "1234567890ß´".split(""),
    "qwertzuiopü+".split(""),
    "asdfghjklöä#".split(""),
    "yxcvbnm,.-".split(""),
];

export const QWERTY_KEYBOARD = [
    "1234567890-=".split(""),
    "qwertyuiop[]".split(""),
    "asdfghjkl;'".split(""),
    "zxcvbnm,./".split(""),
];
