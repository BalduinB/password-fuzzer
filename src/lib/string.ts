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
        let newSequence = prev + (maxNumber + i);

        results.push(newSequence);
        prev = newSequence;
    }
    return results;
}

export function countUp(str: string, iterations = 3) {
    const number = +str;
    const results: Array<string> = [];
    for (let i = 1; i <= iterations; i++) {
        results.push((number + i).toString());
        if (number - i > 0) results.push((number - i).toString());
    }
    return results;
}
export function isOnlyFirstCharUpper(str: string) {
    const [first, ...rest] = str;
    const restStr = rest.join("");
    if (!first) return false;
    return first === first.toUpperCase() && restStr === restStr.toLowerCase();
}

export function onlyFirstCharUpper(str: string) {
    const lowered = str.toLocaleLowerCase();
    const [first, ...rest] = lowered;
    if (!first) return "";
    const restStr = rest.join("");

    return first.toUpperCase() + restStr.toLowerCase();
}
export function onlyLastCharUpper(str: string) {
    return onlyFirstCharUpper(str.split("").reverse().join(""))
        .split("")
        .reverse()
        .join("");
}

export function upperFirst(str: string) {
    const [first, ...rest] = str;
    const restStr = rest.join("");
    if (!first) return false;
    return first.toUpperCase() + restStr.toLowerCase();
}

export function removeCharAt(str: string, index: number) {
    return str.slice(0, index) + str.slice(index + 1);
}
