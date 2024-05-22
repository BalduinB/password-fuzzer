import { and, eq } from "drizzle-orm";
import { batchedGetLeakData } from "../c3";
import { db } from "./client";
import { analysedData, analysedDataTest } from "./schema";
import { globalBaseStats } from "../stats";

export const CURRENT_VERSION = "BASE";
export async function insertBaseDataIntoAnalysedData(
    data: Awaited<ReturnType<typeof batchedGetLeakData> & { originalVersionId?: number }>,
    pwType: string,
) {
    const BATCH_SIZE = 500;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await db.insert(analysedData).values(
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
            eq(analysedData.email, email),
            eq(analysedData.pw, password),
            eq(analysedData.pwType, "base"),
            eq(analysedData.version, CURRENT_VERSION),
        ),
    });
    return !res;
}

async function retrieveIds(pwType: string) {
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

export async function insertIntoAnalysedData(
    data: Awaited<ReturnType<typeof batchedGetLeakData>>,
    pwType: string,
    originalVersionId?: number,
) {
    const BATCH_SIZE = 500;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await db.insert(analysedData).values(
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
    const res = await db.query.analysedData.findFirst({
        where: and(eq(analysedData.version, CURRENT_VERSION)),
    });
    return !res;
}

export async function getBaseDataFromDB() {
    const data = await db.query.analysedData.findMany({
        where: and(eq(analysedData.pwType, "base"), eq(analysedData.version, CURRENT_VERSION)),
        with: { fuzzedPasswords: { limit: 1 } },
    });

    const notFuzzedBasePasswords = data
        .filter((d) => !d.fuzzedPasswords.length)
        .map((data) => ({
            email: data.email,
            password: data.pw,
            isLeaked: data.hit,
            databaseId: data.id,
        }));
    globalBaseStats.totalPasswords = 30000;
    globalBaseStats.leakedPasswords = data.filter((p, i) => i < 30000 && p.hit).length;
    const alreadyFuzzedBasePasswords = data.length - notFuzzedBasePasswords.length;
    return notFuzzedBasePasswords.slice(0, 30000 - alreadyFuzzedBasePasswords);
}
