import { and, eq } from "drizzle-orm";
import { batchedGetLeakData } from "../c3";
import { db } from "./client";
import { analysedData, analysedDataTest } from "./schema";

export const CURRENT_VERSION = "BASE";
export async function insertBaseDataIntoAnalysedData(
    data: Awaited<ReturnType<typeof batchedGetLeakData> & { originalVersionId?: number }>,
    pwType: string,
) {
    const BATCH_SIZE = 500;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await db.insert(analysedDataTest).values(
            batch.map((data) => ({
                email: data.email,
                pw: data.password,
                pwType,
                version: CURRENT_VERSION,
                hit: data.isLeaked,
            })),
        );
    }

    return await retrieveIds(pwType);
}

export async function alreadyExists(email: string, password: string) {
    const res = await db.query.analysedData.findFirst({
        where: and(
            eq(analysedDataTest.email, email),
            eq(analysedDataTest.pw, password),
            eq(analysedDataTest.pwType, "base"),
            eq(analysedDataTest.version, CURRENT_VERSION),
        ),
    });
    return !res;
}

async function retrieveIds(pwType: string) {
    return await db
        .select({
            email: analysedDataTest.email,
            password: analysedDataTest.pw,
            isLeaked: analysedDataTest.hit,
            databaseId: analysedDataTest.id,
        })
        .from(analysedDataTest)
        .where(
            and(eq(analysedDataTest.pwType, pwType), eq(analysedDataTest.version, CURRENT_VERSION)),
        );
}

export async function insertIntoAnalysedData(
    data: Awaited<ReturnType<typeof batchedGetLeakData>>,
    pwType: string,
    originalVersionId?: number,
) {
    const BATCH_SIZE = 500;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await db.insert(analysedDataTest).values(
            batch.map((data) => ({
                email: data.email,
                pw: data.password,
                pwType,
                version: CURRENT_VERSION,
                hit: data.isLeaked,
                originalVersionId,
            })),
        );
    }
}
export async function isNewVersion() {
    const BATCH_SIZE = 500;

    const res = await db.query.analysedDataTest.findFirst({
        where: and(eq(analysedDataTest.version, CURRENT_VERSION)),
    });
    return !res;
}
