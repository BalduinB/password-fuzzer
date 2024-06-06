import { appendLeakCheck } from "@/evaluation/c3";
import { insertIntoAnalysedData, isNewVersion } from "@/evaluation/db/analysed-data";
import { SAMPLE_SIZE } from "@/evaluation/sample-set";
import {
    addStats,
    calculateStatistics,
    displayFuzzerStatistics,
    globalBaseStats,
    incThrows,
    logGlobalStats,
} from "@/evaluation/stats";
import { getBaseSet } from "@/evaluation/steps/handle-sample-set";
import { waitFor } from "@/lib/promise";

import { fuzzPassword } from "./fuzz-password";

export async function main() {
    if (!(await isNewVersion())) throw new Error("Version already exists");
    while (globalBaseStats.totalPasswords < SAMPLE_SIZE) {
        try {
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
            await waitFor(10_000);
        } catch (error) {
            incThrows();
            console.error("LOOP THROW", error);
        }
    }
    console.info("FINISH!!!");
}
