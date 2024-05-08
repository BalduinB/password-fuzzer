import {
    FAILED_CREADENTIALS_CHECK,
    TIMEDOUT_CREADENTIALS_CHECK,
    appendLeakCheck,
    batchedGetLeakData,
} from "./c3";
import {
    insertIntoAnalysedData,
    insertIntoAnalycedDataReturningId as insertIntoAnalysedDataReturningId,
} from "./db/analysed-data";
import { displayStatistics } from "./display";
import { fuzzPassword } from "./generate-passwords";
import { Statistic } from "./types";
import { SAMPLE_SIZE, getRandomPairsFromFS } from "./sample-set";

const DEFAULT_FUZZER_STATISTIC: Statistic = {
    generatedPasswords: 0,
    leakedPasswords: 0,
    leakPercentage: 0,
};

const globalFuzzerStats: Record<string, Statistic> = {};
const globalBaseStats = {
    totalPasswords: 0,
    leakedPasswords: 0,
};

main();

async function main() {
    while (globalBaseStats.totalPasswords <= SAMPLE_SIZE) {
        console.time("getRandomPairsFromFS");
        const randomDataSet = await getRandomPairsFromFS(
            SAMPLE_SIZE - globalBaseStats.totalPasswords,
        );
        console.timeEnd("getRandomPairsFromFS");

        console.time("batchedGetLeakDataOG");
        const dataWithLeakHit = await batchedGetLeakData(randomDataSet);
        console.timeEnd("batchedGetLeakDataOG");
        globalBaseStats.totalPasswords += randomDataSet.length;
        globalBaseStats.leakedPasswords += dataWithLeakHit.filter((p) => p.isLeaked).length;
        console.time("insertIntoAnalysedDataOG");
        const dataWithDbId = await insertIntoAnalysedDataReturningId(dataWithLeakHit, "base");
        console.time("insertIntoAnalysedDataOG");
        let i = 0;
        for (const { email, password, databaseId: originalVersionId } of dataWithDbId) {
            console.log(`Checking: ${email} ${password} ${++i}/${dataWithDbId.length}`);

            const fuzzedPasswords = fuzzPassword(password);
            console.time("batchedGetLeakData");
            const leakedResults = await appendLeakCheck(email, fuzzedPasswords);
            console.timeEnd("batchedGetLeakData");
            for (const { method, leakChecks } of leakedResults) {
                console.time("insertIntoAnalysedData");

                await insertIntoAnalysedData(
                    leakChecks.map((data) => ({ ...data, email })),
                    method,
                    originalVersionId,
                );
                console.timeEnd("insertIntoAnalysedData");
            }
            const statsOfPair = calculateStatistics(leakedResults, password);

            for (const { method, ...stats } of statsOfPair) {
                addStats(method, stats);
            }
            console.log("FAILED: ", FAILED_CREADENTIALS_CHECK);
            console.log("TIMEOUT: ", TIMEDOUT_CREADENTIALS_CHECK);
            console.log("TOTAL BASE PAIRS: ", globalBaseStats.totalPasswords);
            console.log("LEAKED BASE PAIRS: ", globalBaseStats.leakedPasswords);

            displayStatistics(
                Object.entries(globalFuzzerStats).map(([method, stats]) => ({ method, ...stats })),
            );
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
