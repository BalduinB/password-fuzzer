import { CharGroup, MAX_LENGTH, MIN_LENGTH, getGroupMask } from "./lib/config";
import { isLowerCase, isNumber, isSymbol, isUpperCase } from "./lib/password";

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
            mask = this.calculateMask();
            this.mask = mask;
        }
        return mask;
    }

    getClass() {
        let pwClass = this.class;
        if (!pwClass) {
            pwClass = this.calculateClass();
            this.class = pwClass;
        }
        return pwClass;
    }

    getElements() {
        let elements = this.elements;
        if (!elements) {
            elements = this.calculateElements();
            this.elements = elements;
        }
        return elements;
    }

    private calculateMask() {
        let mask = "";
        for (const char of this.password) {
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

    private calculateClass() {
        const mask = this.getMask();
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
    private calculateElements() {
        const mask = this.calculateMask();

        return mask.split("").reduce((elements, currMask, idx) => {
            const prevMask = mask[idx - 1];
            if (idx === 0) {
                elements.push(this.password[idx] ?? "");
            } else if (currMask === prevMask) {
                elements[elements.length - 1] += this.password[idx];
            } else elements.push(this.password[idx] ?? "");
            return elements;
        }, [] as Array<string>);
    }
}
