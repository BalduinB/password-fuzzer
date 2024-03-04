export function isNumberSequence(str: string) {
    return str
        .split("")
        .map((n) => parseInt(n))
        .every((num, idx, arr) => idx === 0 || num - 1 === arr[idx - 1]);
}
export function expandNumberSequence(str: string, iterations = 5) {
    const numbersOfstr = str.split("").map((n) => parseInt(n));

    const maxNumber = Math.max(...numbersOfstr);
    const results = [];
    let prev = str;

    for (let i = 1; i <= iterations; i++) {
        let newSequence = prev + (maxNumber + i);

        results.push(newSequence);
        prev = newSequence;
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
    const [first, ...rest] = str;
    if (!first) return "";
    const restStr = rest.join("");

    return first.toUpperCase() + restStr.toLowerCase();
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
