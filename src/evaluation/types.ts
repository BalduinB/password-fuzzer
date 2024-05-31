export type Statistic = {
    leakedPasswords: number;
    generatedPasswords: number;
    leakPercentage: number;
};

export type LooseAutocomplete<T extends string> = T | Omit<string, T>;
export type Version = LooseAutocomplete<"V1" | "BASE">;
export type Method = LooseAutocomplete<"our" | "guesser">;
