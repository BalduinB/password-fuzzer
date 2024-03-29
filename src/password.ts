import { MAX_LENGTH, MIN_LENGTH, getGroupMask } from "./lib/config";
import {
    calculateClass,
    calculateElements,
    calculateMask,
} from "./lib/password";

export class Password {
    private mask?: string;
    private class?: string;
    private elements?: Array<string>;
    constructor(public readonly password: string) {}

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
    getMask() {
        let mask = this.mask;
        if (!mask) {
            mask = calculateMask(this.password);
            this.mask = mask;
        }
        return mask;
    }

    getClass() {
        let pwClass = this.class;
        if (!pwClass) {
            pwClass = calculateClass(this.password);
            this.class = pwClass;
        }
        return pwClass;
    }

    getElements() {
        let elements = this.elements;
        if (!elements) {
            elements = calculateElements(this.password);
            this.elements = elements;
        }
        return [...elements];
    }
}
