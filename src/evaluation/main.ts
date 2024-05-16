import { appendLeakCheck, batchedGetLeakData } from "./c3";
import {
    insertIntoAnalysedData,
    insertBaseDataIntoAnalysedData as insertBaseDataIntoAnalysedData,
} from "./db/analysed-data";
import { fuzzPassword } from "./generate-passwords";
import { SAMPLE_SIZE, getDummyFromDB, getRandomPairsFromFS } from "./sample-set";
import {
    addStats,
    calculateStatistics,
    displayFuzzerStatistics,
    globalBaseStats,
    incThrows,
    logGlobalStats,
} from "./stats";

main();

async function main() {
    while (globalBaseStats.totalPasswords < SAMPLE_SIZE) {
        try {
            const randomDataSet = await getRandomPairsFromFS(200);
            // const randomDataSet = await getDummyFromDB();
            console.log(`Got random data set ${randomDataSet.length}`);
            console.time("batchedGetLeakDataBase");
            const dataWithLeakHit = await batchedGetLeakData(randomDataSet);
            console.timeEnd("batchedGetLeakDataBase");
            globalBaseStats.totalPasswords += randomDataSet.length;
            globalBaseStats.leakedPasswords += dataWithLeakHit.filter((p) => p.isLeaked).length;

            logGlobalStats();
            console.time("insertIntoAnalysedDataBase");
            const dataWithDbId = await insertBaseDataIntoAnalysedData(dataWithLeakHit, "base");
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
}
