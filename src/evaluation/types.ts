export type Statistic = {
    leakedPasswords: number;
    generatedPasswords: number;
    leakPercentage: number;
};

export type LooseAutocomplete<T extends string> = T | Omit<string, T>;
export type Version = LooseAutocomplete<"BASE" | "V1" | "V2">;
export type Method = LooseAutocomplete<"guesser" | "tdt" | "our">;
