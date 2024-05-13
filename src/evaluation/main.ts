import {
    FAILED_CREADENTIALS_CHECK,
    TIMEDOUT_CREADENTIALS_CHECK,
    appendLeakCheck,
    batchedGetLeakData,
} from "./c3";
import {
    insertIntoAnalysedData,
    insertIntoAnalysedDataReturningId as insertIntoAnalysedDataReturningId,
} from "./db/analysed-data";
import { displayFuzzerStatistics } from "./display";
import { fuzzPassword } from "./generate-passwords";
import { Statistic } from "./types";
import { SAMPLE_SIZE, getDummyFromDB, getRandomPairsFromFS } from "./sample-set";
import { fNumber } from "./helpers/formaters";

const DEFAULT_FUZZER_STATISTIC: Statistic = {
    generatedPasswords: 0,
    leakedPasswords: 0,
    leakPercentage: 0,
};

let totalThrows = 0;
const globalFuzzerStats: Record<string, Statistic> = {};
const globalBaseStats = {
    totalPasswords: 0,
    leakedPasswords: 0,
};
export const tooManyGenerations = {
    tdt: 0,
    our: 0,
};

main();

async function main() {
    while (globalBaseStats.totalPasswords < SAMPLE_SIZE) {
        try {
            const randomDataSet = await getRandomPairsFromFS(
                SAMPLE_SIZE - globalBaseStats.totalPasswords,
            );
            // const randomDataSet = await getDummyFromDB();
            console.time("batchedGetLeakDataBase");
            const dataWithLeakHit = await batchedGetLeakData(randomDataSet);
            console.timeEnd("batchedGetLeakDataBase");
            globalBaseStats.totalPasswords += randomDataSet.length;
            globalBaseStats.leakedPasswords += dataWithLeakHit.filter((p) => p.isLeaked).length;

            logGlobalStats();

            console.time("insertIntoAnalysedDataBase");
            const dataWithDbId = await insertIntoAnalysedDataReturningId(dataWithLeakHit, "base");
            console.timeEnd("insertIntoAnalysedDataBase");
            let i = 0;
            for (const { email, password, databaseId: originalVersionId } of dataWithDbId) {
                try {
                    console.log(`Checking: ${email} ${password} ${++i}/${dataWithDbId.length}`);

                    const fuzzedPasswords = fuzzPassword(password);
                    const leakedResults = await appendLeakCheck(email, fuzzedPasswords);
                    for (const { method, leakChecks } of leakedResults) {
                        await insertIntoAnalysedData(
                            leakChecks.map((data) => ({ ...data, email })),
                            method,
                            originalVersionId,
                        );
                    }
                    const statsOfPair = calculateStatistics(leakedResults, password);

                    for (const { method, ...stats } of statsOfPair) {
                        addStats(method, stats);
                    }
                } catch (error) {
                    totalThrows++;
                    console.error("ITERATION THROW", error);
                }
                logGlobalStats();
                displayFuzzerStatistics(
                    Object.entries(globalFuzzerStats).map(([method, stats]) => ({
                        method,
                        ...stats,
                    })),
                );
            }
            console.log("DONE WITH THIS ITERATION");
            await new Promise((resolve) => setTimeout(resolve, 10_000));
        } catch (error) {
            totalThrows++;
            console.error("LOOP THROW", error);
        }
    }
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

function logGlobalStats() {
    console.log("FAILED: ", fNumber(FAILED_CREADENTIALS_CHECK));
    console.log("TIMEOUT: ", fNumber(TIMEDOUT_CREADENTIALS_CHECK));
    console.log(
        "OVERGENERATED: ",
        "our: ",
        tooManyGenerations.our,
        "tdt: ",
        tooManyGenerations.tdt,
    );
    console.log("THROWS: ", totalThrows);
    console.log("TOTAL BASE PAIRS: ", fNumber(globalBaseStats.totalPasswords));
    console.log("LEAKED BASE PAIRS: ", fNumber(globalBaseStats.leakedPasswords));
}

function addStats(method: string, stats: Statistic) {
    let currerntStats = globalFuzzerStats[method];
    if (!currerntStats) {
        currerntStats = globalFuzzerStats[method] = { ...DEFAULT_FUZZER_STATISTIC };
    }
    currerntStats.generatedPasswords += stats.generatedPasswords;
    currerntStats.leakedPasswords += stats.leakedPasswords;

    currerntStats.leakPercentage =
        (currerntStats.leakedPasswords / currerntStats.generatedPasswords) * 100;
}
