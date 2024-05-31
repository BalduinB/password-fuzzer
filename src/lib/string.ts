export function isNumberSequence(str: string) {
    return str
        .split("")
        .map((n) => parseInt(n))
        .every((num, idx, arr) => idx === 0 || num - 1 === arr[idx - 1]);
}
export function expandNumberSequence(str: string, iterations = 3) {
    const numbersOfstr = str.split("").map((n) => parseInt(n));

    const maxNumber = Math.max(...numbersOfstr);
    const results = [];
    if (iterations < 0) {
        for (let i = 1; i <= Math.abs(iterations); i++) {
            if (numbersOfstr.length <= 1) break;

            numbersOfstr.pop();
            results.push(numbersOfstr.join(""));
        }
        return results;
    }
    let prev = str;

    for (let i = 1; i <= iterations; i++) {
        const newNumber = maxNumber + i;
        if (newNumber > 9) break;
        const newSequence = prev + newNumber;

        results.push(newSequence);
        prev = newSequence;
    }
    return results;
}

export function countUp(str: string, iterations = 2) {
    const number = +str;
    const results: Array<string> = [];
    for (let i = 1; i <= iterations; i++) {
        results.push((number + i).toString());
    }
    return results;
}
export function countUpnDown(str: string, iterations = 2) {
    const number = +str;
    const results: Array<string> = [];
    for (let i = 1; i <= iterations; i++) {
        results.push((number + i).toString());
        if (number - i > -1) results.push((number - i).toString());
    }
    return results;
}

export function onlyFirstCharUpper(str: string) {
    const lowered = str.toLocaleLowerCase();
    const [first, ...rest] = lowered;
    if (!first) return "";
    const restStr = rest.join("");

    return first.toUpperCase() + restStr.toLowerCase();
}
export function onlyLastCharUpper(str: string) {
    return onlyFirstCharUpper(str.split("").reverse().join("")).split("").reverse().join("");
}

export function onlyUpperFirstAndLast(str: string) {
    if (str.length === 1) return str.toUpperCase();
    return (
        str.slice(0, 1).toUpperCase() + str.slice(1, -1).toLowerCase() + str.slice(-1).toUpperCase()
    );
}

export function upperFirst(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
export function upperLast(str: string) {
    if (str.length === 1) return str.toUpperCase();
    return str.slice(0, -1) + str.slice(-1).toUpperCase();
}
export function upperFirstAndLast(str: string) {
    if (str.length === 1) return str.toUpperCase();
    return str.slice(0, 1).toUpperCase() + str.slice(1, -1) + str.slice(-1).toUpperCase();
}

export function removeCharAt(str: string, index: number) {
    return str.slice(0, index) + str.slice(index + 1);
}
export function isLetterOnly(str: string) {
    return /^[a-zA-Z]+$/.test(str);
}
