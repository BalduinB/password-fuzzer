import { uppercase, lowercase, numbers, symbols } from "./config";

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
