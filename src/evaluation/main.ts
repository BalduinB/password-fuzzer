import { appendLeakCheck, batchedGetLeakData } from "./c3";
import {
    insertIntoAnalysedData,
    insertBaseDataIntoAnalysedData as insertBaseDataIntoAnalysedData,
    isNewVersion,
    getOpenBaseDataFromDB,
} from "./db/analysed-data";
import { fuzzPassword } from "./generate-passwords";
import { SAMPLE_SIZE, getRandomPairsFromFS } from "./sample-set";
import {
    addStats,
    calculateStatistics,
    displayFuzzerStatistics,
    globalBaseStats,
    incThrows,
    logGlobalStats,
} from "./stats";

export async function main() {
    // if (!(await isNewVersion())) throw new Error("Version already exists");
    let round = 0;
    while (globalBaseStats.totalPasswords < SAMPLE_SIZE) {
        try {
            round++;
            console.log(new Date().toLocaleString("de-DE"));
            const dataWithDbId = await getBaseSet();
            let i = 0;
            for (const { email, password, databaseId: originalVersionId } of dataWithDbId) {
                i++;
                try {
                    console.log(
                        `Checking: ${email} ${password} DB:${originalVersionId} ${i}/${dataWithDbId.length} - ${new Date().toLocaleString("de-DE")}`,
                    );
                    const fuzzedPasswords = fuzzPassword(password);
                    logGlobalStats();
                    console.time("appendLeak");
                    const leakedResults = await appendLeakCheck(email, fuzzedPasswords);
                    console.timeEnd("appendLeak");
                    console.time("insert");
                    for (const { method, leakChecks } of leakedResults) {
                        await insertIntoAnalysedData(
                            leakChecks.map((data) => ({ ...data, email })),
                            method,
                            originalVersionId,
                        );
                    }
                    console.timeEnd("insert");
                    const statsOfPair = calculateStatistics(leakedResults, password);

                    for (const { method, ...stats } of statsOfPair) {
                        addStats(method, stats);
                    }
                } catch (error) {
                    incThrows();
                    console.error("ITERATION THROW", error);
                }
                logGlobalStats();
                displayFuzzerStatistics();
            }
            console.log("DONE WITH THIS ITERATION");
            await new Promise((resolve) => setTimeout(resolve, 10_000));
        } catch (error) {
            incThrows();
            console.error("LOOP THROW", error);
        }
    }
    console.info("FINISH!!!");
}

async function getBaseSet() {
    const randomDataSet = await getRandomPairsFromFS(globalBaseStats.totalPasswords);

    console.time("batchedGetLeakDataBase");
    const dataWithLeakHit = await batchedGetLeakData(randomDataSet);
    console.timeEnd("batchedGetLeakDataBase");

    globalBaseStats.totalPasswords += randomDataSet.length;
    globalBaseStats.leakedPasswords += dataWithLeakHit.filter((p) => p.isLeaked).length;

    logGlobalStats();
    console.log(new Date().toLocaleString("de-DE"));
    console.time("insertIntoAnalysedDataBase");
    const dataWithDbId = await insertBaseDataIntoAnalysedData(dataWithLeakHit, "base");
    console.timeEnd("insertIntoAnalysedDataBase");
    return dataWithDbId;
}

export async function retrievFromDB() {
    const data = await getOpenBaseDataFromDB();
    logGlobalStats();
    return data;
}
