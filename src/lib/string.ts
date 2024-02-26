export function isNumberSequence(str: string) {
    return str
        .split("")
        .map(parseInt)
        .every((num, idx, arr) => {
            if (idx === 0) return true;
            return num - 1 === arr[idx - 1];
        });
}
