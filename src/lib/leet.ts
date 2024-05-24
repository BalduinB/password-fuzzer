export function isLeetalble(char: string, map: Record<string, Array<string>>) {
    char = char.toLowerCase();
    return char in map || Object.values(map).some((v) => v.includes(char));
}
export function getLeetedChars(char: string, map: Record<string, Array<string>>) {
    char = char.toLowerCase();

    const leetChars = map[char];
    if (leetChars) return leetChars;

    return Object.entries(map).reduce((possibleReplacements, [k, v]) => {
        if (v.includes(char)) possibleReplacements.push(k);
        return possibleReplacements;
    }, [] as Array<string>);
}
