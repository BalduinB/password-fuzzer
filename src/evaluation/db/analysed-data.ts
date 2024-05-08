import { sql } from "drizzle-orm";
import { batchedGetLeakData } from "../c3";
import { db } from "./client";
import { analysedData, analysedDataTest } from "./schema";

export const CURRENT_VERSION = "BASE";
export async function insertIntoAnalycedDataReturningId(
    data: Awaited<ReturnType<typeof batchedGetLeakData> & { originalVersionId?: number }>,
    pwType: string,
) {
    console.time("insertIntoAnalycedDataReturningId");
    const res = await Promise.all(
        data.map(async (data) => {
            const [resultHeader] = await db
                .insert(analysedDataTest)
                .values({
                    email: data.email,
                    pw: data.password,
                    pwType,
                    version: CURRENT_VERSION,
                    hits: data.isLeaked ? 1 : 0,
                    originalVersionId: 0,
                })
                .onDuplicateKeyUpdate({
                    set: { hits: sql`hit + ${data.isLeaked ? 1 : 0}` },
                });
            return { ...data, databaseId: resultHeader.insertId };
        }),
    );
    console.timeEnd("insertIntoAnalycedDataReturningId");
    return res;
}
export async function insertIntoAnalysedData(
    data: Awaited<ReturnType<typeof batchedGetLeakData>>,
    pwType: string,
    originalVersionId?: number,
) {
    console.time("insertIntoAnalysedData");
    await Promise.all(
        data.map(async (data) => {
            await db
                .insert(analysedDataTest)
                .values({
                    email: data.email,
                    pw: data.password,
                    pwType,
                    version: CURRENT_VERSION,
                    hits: data.isLeaked ? 1 : 0,
                    originalVersionId,
                })
                .onDuplicateKeyUpdate({
                    set: { hits: sql`hit + ${data.isLeaked ? 1 : 0}` },
                });
        }),
    );
    console.timeEnd("insertIntoAnalysedData");
}
