import { and, eq, ne } from "drizzle-orm";
import { batchedGetLeakData } from "../c3";
import { db } from "./client";
import { analysedData } from "./schema";
import { globalBaseStats } from "../stats";
import { Method, Version } from "../types";

export const CURRENT_VERSION = "V2";
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

    return await retrieveWithIds(pwType);
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

export async function retrieveWithIds(pwType: string) {
    const data = await db.query.analysedData.findMany({
        where: and(eq(analysedData.pwType, pwType), eq(analysedData.version, CURRENT_VERSION)),
        with: { fuzzedPasswords: { limit: 1, where: ne(analysedData.pwType, "REMOVED") } },
    });
    return data
        .filter((d) => !d.fuzzedPasswords.length)
        .map((data) => ({
            email: data.email,
            password: data.pw,
            isLeaked: data.hit,
            databaseId: data.id,
        }));
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

export async function getOpenBaseDataFromDB() {
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
    globalBaseStats.totalPasswords = data.length;
    globalBaseStats.leakedPasswords = data.filter((p, i) => i < 30000 && p.hit).length;
    return notFuzzedBasePasswords;
}

export async function getBaseDataFromDB(
    version: Version = CURRENT_VERSION,
    fuzzed?: "ONE" | "ALL",
) {
    return await db.query.analysedData.findMany({
        where: and(eq(analysedData.pwType, "base"), eq(analysedData.version, version as string)),
        with: {
            fuzzedPasswords: {
                where: ne(analysedData.pwType, "REMOVED"),
                limit: fuzzed === "ALL" ? undefined : 1,
            },
        },
    });
}

export async function passwordsOfMethodAndVersion(args: {
    method: Method;
    isLeaked?: boolean;
    version?: Version;
    type?: "ALL" | "UNIQUE_TO_METHOD";
}) {
    const { method, isLeaked, version = CURRENT_VERSION, type = "ALL" } = args;
    const data = await db
        .select({
            pw: analysedData.pw,
            pwType: analysedData.pwType,
            originalVersion: subQuery.pw,
            originalVersionId: subQuery.id,
        })
        .from(analysedData)
        .innerJoin(subQuery, eq(subQuery.id, analysedData.originalVersionId))
        .where(
            and(
                eq(analysedData.version, version as string),
                method === "not_base"
                    ? ne(analysedData.pwType, "base")
                    : eq(analysedData.pwType, method as string),
                isLeaked !== undefined ? eq(analysedData.hit, isLeaked) : undefined,
            ),
        );

    if (type === "ALL") return data;
    const filter = [];
    for (const item of data) {
        if (!(await isUniquePw(item, version))) {
            continue;
        }

        filter.push(item);
    }
    return filter;
}

async function isUniquePw(
    item: { pw: string; originalVersionId: number; pwType: string },
    version: Version,
) {
    return !(await db.query.analysedData.findFirst({
        where: and(
            eq(analysedData.pw, item.pw),
            eq(analysedData.version, version as string),
            eq(analysedData.originalVersionId, item.originalVersionId),
            ne(analysedData.pwType, item.pwType),
        ),
    }));
}

const subQuery = db.select().from(analysedData).as("subQuery");
