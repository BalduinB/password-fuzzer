import { CharGroup, MAX_LENGTH, MIN_LENGTH, getGroupMask } from "./lib/config";
import {
    calculateClass,
    calculateElements,
    calculateMask,
    isLowerCase,
    isNumber,
    isSymbol,
    isUpperCase,
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
    isTooShort() {
        return this.password.length < MIN_LENGTH;
    }
    isTooLong() {
        return this.password.length > MAX_LENGTH;
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
        return elements;
    }
}
