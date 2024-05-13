import { and, eq, sql } from "drizzle-orm";
import { batchedGetLeakData } from "../c3";
import { db } from "./client";
import { analysedData } from "./schema";

export const CURRENT_VERSION = "BASE";
export async function insertIntoAnalysedDataReturningId(
    data: Awaited<ReturnType<typeof batchedGetLeakData> & { originalVersionId?: number }>,
    pwType: string,
) {
    const res = await Promise.all(
        data.map(async (data) => {
            const [resultHeader] = await db
                .insert(analysedData)
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

    return res;
}

export async function alreadyExists(email: string, password: string) {
    const res = await db.query.analysedData.findFirst({
        where: and(
            eq(analysedData.email, email),
            eq(analysedData.pw, password),
            eq(analysedData.pwType, "base"),
            eq(analysedData.version, CURRENT_VERSION),
        ),
    });
    return !res;
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
                .insert(analysedData)
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
