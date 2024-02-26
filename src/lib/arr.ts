export function shuffle<T>(arr: Array<string>) {
    return arr.toSorted(() => Math.random() - 0.5);
}
