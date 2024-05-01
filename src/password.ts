import { MAX_LENGTH, MIN_LENGTH, getGroupMask } from "./lib/config";
import { calculateClass, calculateElements, calculateMask } from "./lib/password";

export class Password {
    private mask: string;
    private class: string;
    private elements: Array<string>;
    constructor(public readonly password: string) {
        this.mask = calculateMask(password);
        this.class = calculateClass(password);
        this.elements = calculateElements(password);
    }

    hasSpecialChar() {
        return this.getMask().includes(getGroupMask("symbols"));
    }

    hasNumbers() {
        return this.getMask().includes(getGroupMask("numbers"));
    }
    indexesOf(char: string) {
        const indexes: Array<number> = [];
        for (let i = 0; i < this.password.length; i++) {
            if (this.password[i] === char) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    isTooShort() {
        return this.password.length < MIN_LENGTH;
    }
    isTooLong() {
        return this.password.length > MAX_LENGTH;
    }
    isAlphabeticOnly() {
        return (
            !this.getClass().includes(getGroupMask("numbers")) &&
            !this.getClass().includes(getGroupMask("symbols"))
        );
    }
    isNumericOnly() {
        return !isNaN(+this.password) && Number.isInteger(+this.password);
    }
    getMask() {
        return this.mask;
    }

    getClass() {
        return this.class;
    }
    getGroupOfElement(element: string) {
        if (!this.password.includes(element)) {
            throw new Error(`Element '${element}' not in password`);
        }
        const maskOfChars = calculateMask(element);
        if (maskOfChars.split("").every((char) => char === maskOfChars[0])) {
            return maskOfChars[0]!;
        } else throw new Error(`Element '${element}' is not a group`);
    }
    getElements() {
        return [...this.elements];
    }
}
