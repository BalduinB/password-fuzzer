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
