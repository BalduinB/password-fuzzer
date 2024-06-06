import { batchedGetLeakData } from "../c3";
import { insertBaseDataIntoAnalysedData } from "../db/analysed-data";
import { getRandomPairsFromFS } from "../sample-set";
import { globalBaseStats, logGlobalStats } from "../stats";

export async function getBaseSet() {
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
