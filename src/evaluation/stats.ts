import { FAILED_CREADENTIALS_CHECK, TIMEDOUT_CREADENTIALS_CHECK, appendLeakCheck } from "./c3";
import { fNumber } from "./helpers/formaters";
import { Statistic } from "./types";

export const DEFAULT_FUZZER_STATISTIC: Statistic = {
    generatedPasswords: 0,
    leakedPasswords: 0,
    leakPercentage: 0,
};

let totalThrows = 0;

export const globalFuzzerStats: Record<string, Statistic> = {};
export const globalBaseStats = {
    totalPasswords: 0,
    leakedPasswords: 0,
};
export const tooManyGenerations = {
    tdt: 0,
    our: 0,
    guesser: 0,
};
export function incThrows() {
    totalThrows++;
}
export function calculateStatistics(
    data: Awaited<ReturnType<typeof appendLeakCheck>>,
    ogPassword: string,
): Array<{ method: string } & Statistic> {
    return data.map(({ method, leakChecks }) => {
        const leakedPasswords = leakChecks.filter(
            (value) => value.isLeaked && value.password !== ogPassword,
        ).length;
        const generatedPasswords = leakChecks.length;
        const leakPercentage = (leakedPasswords / generatedPasswords) * 100;

        return { method, generatedPasswords, leakedPasswords, leakPercentage };
    });
}

export function logGlobalStats() {
    console.log("FAILED: ", fNumber(FAILED_CREADENTIALS_CHECK));
    console.log("TIMEOUT: ", fNumber(TIMEDOUT_CREADENTIALS_CHECK));
    console.log(
        "OVERGENERATED: ",
        "guesser: ",
        tooManyGenerations.guesser,
        "our: ",
        tooManyGenerations.our,
        "tdt: ",
        tooManyGenerations.tdt,
    );
    console.log("THROWS: ", totalThrows);
    console.log("TOTAL BASE PAIRS: ", fNumber(globalBaseStats.totalPasswords));
    console.log("LEAKED BASE PAIRS: ", fNumber(globalBaseStats.leakedPasswords));
}

export function addStats(method: string, stats: Statistic) {
    let currerntStats = globalFuzzerStats[method];
    if (!currerntStats) {
        currerntStats = globalFuzzerStats[method] = { ...DEFAULT_FUZZER_STATISTIC };
    }
    currerntStats.generatedPasswords += stats.generatedPasswords;
    currerntStats.leakedPasswords += stats.leakedPasswords;

    currerntStats.leakPercentage =
        (currerntStats.leakedPasswords / currerntStats.generatedPasswords) * 100;
}

export function displayFuzzerStatistics() {
    console.table(
        Object.entries(globalFuzzerStats).map(([method, stats]) => ({
            method,
            ...stats,
        })),
    );
}
