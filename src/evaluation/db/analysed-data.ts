import { and, eq } from "drizzle-orm";
import { batchedGetLeakData } from "../c3";
import { db } from "./client";
import { analysedData, analysedDataTest } from "./schema";

export const CURRENT_VERSION = "BASE2";
export async function insertBaseDataIntoAnalysedData(
    data: Awaited<ReturnType<typeof batchedGetLeakData> & { originalVersionId?: number }>,
    pwType: string,
) {
    await db.insert(analysedData).values(
        data.map((data) => ({
            email: data.email,
            pw: data.password,
            pwType,
            version: CURRENT_VERSION,
            hit: data.isLeaked,
        })),
    );
    return await db
        .select({
            email: analysedData.email,
            password: analysedData.pw,
            isLeaked: analysedData.hit,
            databaseId: analysedData.id,
        })
        .from(analysedData)
        .where(and(eq(analysedData.pwType, pwType), eq(analysedData.version, CURRENT_VERSION)));
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
    await Promise.all(
        data.map(async (data) => {
            await db.insert(analysedData).values({
                email: data.email,
                pw: data.password,
                pwType,
                version: CURRENT_VERSION,
                hit: data.isLeaked,
                originalVersionId,
            });
        }),
    );
}
