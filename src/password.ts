import { getGroupMask } from "./lib/config";
import { isLowerCase, isNumber, isSymbol, isUpperCase } from "./lib/password";

export class Password {
    private mask?: string;

    constructor(public password: string) {}

    getMask() {
        let mask = this.mask;
        if (!mask) {
            mask = this.calculateMask();
            this.mask = mask;
        }
        return mask;
    }

    getClass() {
        return this.calculateClass();
    }
    getElements() {
        const mask = this.calculateMask();

        mask.split("").reduce((elements, currMask, idx) => {
            const prevMask = mask[idx - 1];
            if (idx === 0) {
                elements.push(this.password[idx] ?? "");
            } else if (currMask === prevMask) {
                elements[elements.length - 1] += this.password[idx];
            } else elements.push(this.password[idx] ?? "");
            return elements;
        }, [] as Array<string>);
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

    private calculateMask() {
        let mask = "";
        for (const char of this.password) {
            if (isUpperCase(char)) {
                mask += getGroupMask("uppercase");
            } else if (isLowerCase(char)) {
                mask += getGroupMask("lowercase");
            } else if (isNumber(char)) {
                mask += getGroupMask("numbers");
            } else if (isSymbol(char)) {
                mask += getGroupMask("symbols");
            } else {
                mask += getGroupMask("unknown");
            }
        }
        return mask;
    }
}
