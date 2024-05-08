import { getGroupMask } from "./lib/config";
import {
    calculateClass,
    calculateElements,
    calculateElementsWithAlpha,
    calculateMask,
    isTooLong,
    isTooShort,
} from "./lib/password";

export class Password {
    private mask: string;
    private class: string;
    private elements: Array<string>;
    private elementsWithAlphas: Array<string>;
    constructor(public readonly password: string) {
        this.mask = calculateMask(password);
        this.class = calculateClass(password);
        this.elements = calculateElements(password);
        this.elementsWithAlphas = calculateElementsWithAlpha(password);
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
    tooShort() {
        return isTooShort(this.password);
    }
    tooLong() {
        return isTooLong(this.password);
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
    getElementsWithAlphaString() {
        return [...this.elementsWithAlphas];
    }
}
