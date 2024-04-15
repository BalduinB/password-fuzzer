export function shuffle<T>(arr: Array<T>) {
    return arr.toSorted(() => Math.random() - 0.5);
}
