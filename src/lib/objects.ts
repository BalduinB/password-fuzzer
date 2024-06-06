export function enshureKey(obj: Record<string, number>, key: string, defaultValue = 0) {
    if (!obj[key]) obj[key] = defaultValue;
}
