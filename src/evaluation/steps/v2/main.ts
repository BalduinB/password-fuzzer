import { appendLeakCheck } from "@/evaluation/c3";
import {
    getBaseDataFromDB,
    insertIntoAnalysedData,
    isNewVersion,
} from "@/evaluation/db/analysed-data";
import { logGlobalStats } from "@/evaluation/stats";

import { fuzzPassword } from "./fuzz-password";

export async function main() {
    if (!(await isNewVersion())) throw new Error("Version already exists");
    const baseData = await getBaseDataFromDB("BASE", "ALL");
    let i = -1;
    let notExistsTotal = 0;
    for (const pair of baseData) {
        console.log(++i, baseData.length, new Date().toLocaleString("de-DE"));

        const fuzzed = fuzzPassword(pair.pw);
        const notExists = fuzzed.filter(
            (newGeneration) => !pair.fuzzedPasswords.some((p) => p.pw === newGeneration),
        );
        const exists = fuzzed.filter((newGeneration) =>
            pair.fuzzedPasswords.some((p) => p.pw === newGeneration),
        );

        const withIsLeaked = exists.map((e) => {
            const isLeaked = pair.fuzzedPasswords.find((p) => p.pw === e)?.hit;
            if (isLeaked === undefined) {
                throw new Error("No leaked data");
            }
            return { password: e, isLeaked };
        });

        const leakedResults = await appendLeakCheck(pair.email, [
            { method: "our", generated: notExists },
        ]);
        const leakChecks = leakedResults[0]?.leakChecks;
        if (!leakChecks) throw new Error("No leak checks");

        const allData = withIsLeaked.concat(leakChecks);
        await insertIntoAnalysedData(
            allData.map((data) => ({ ...data, email: pair.email })),
            "our",
            pair.id,
        );
        notExistsTotal += notExists.length;
        console.log(`had to check: ${notExistsTotal}`);
        logGlobalStats();
    }
    console.log("DONE");
    console.info("FINISH!!!");
}
