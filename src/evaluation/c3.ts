import { $ } from "bun";
import { assert } from "console";
import { config } from "dotenv";
import { fuzzPassword } from "./generate-passwords";
import { waitFor } from "@/lib/promise";
import { logGlobalStats } from "./stats";
config({
    // debug: true,
    path: "../../.env",
});

export let FAILED_CREADENTIALS_CHECK = 0; //12_070;
export let TIMEDOUT_CREADENTIALS_CHECK = 0; //62;
const BATCH_SIZE = 10;
const TIMEOUT_AFTER_BATCH = 500;

async function hasMatches(email: string, password: string) {
    assert(process.env.API_KEY, "env.API_KEY is required");
    // return Math.random() > 0.5;
    try {
        const response =
            await $`./cli-client --email="${email}" --password="${password}" --api-key=${process.env.API_KEY}`.text();
        return !response.startsWith(CREDENTIALS_NOT_LEAKED_RESPONSE);
    } catch (error) {
        console.error(error, email, password);
        FAILED_CREADENTIALS_CHECK++;
        return false;
    }
}
export async function hasMatchesTimedOut(email: string, password: string) {
    return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
            console.error("Timeout", email, password);
            TIMEDOUT_CREADENTIALS_CHECK++;
            resolve(false);
        }, 5_000);

        hasMatches(email, password).then((res) => {
            clearTimeout(timeout);
            resolve(res);
        });
    });
}
export async function appendLeakCheck(email: string, data: ReturnType<typeof fuzzPassword>) {
    const leakedResults: Array<{
        method: string;
        leakChecks: Array<{ isLeaked: boolean; password: string }>;
    }> = [];
    for (const { generated, method } of data) {
        const leakChecks = await batchedHasMatches(email, generated);
        leakedResults.push({
            method,
            leakChecks: leakChecks.map((isLeaked, i) => ({ isLeaked, password: generated[i]! })),
        });
    }
    return leakedResults;
}

export async function batchedHasMatches(email: string, passwords: Array<string>) {
    const results: Array<boolean> = [];

    for (let i = 0; i < passwords.length; i += BATCH_SIZE) {
        console.log("batchedHasMatches", i, "of", passwords.length);
        const batch = passwords.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.all(
            batch.map(async (password) => await hasMatchesTimedOut(email, password)),
        );
        results.push(...batchResults);
        await waitFor(TIMEOUT_AFTER_BATCH);
    }
    return results;
}

export async function batchedGetLeakData(data: Array<{ email: string; password: string }>) {
    const results: Array<{ email: string; password: string; isLeaked: boolean }> = [];

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        // console.log("batchedGetLeakData", i, "of", data.length);
        const batch = data.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map(async ({ email, password }) => ({
                email,
                password,
                isLeaked: await hasMatchesTimedOut(email, password),
            })),
        );

        results.push(...batchResults);
        await waitFor(TIMEOUT_AFTER_BATCH);
        logGlobalStats();
    }

    return results;
}
const CREDENTIALS_NOT_LEAKED_RESPONSE = "Your credentials are not known to be leaked.";
const _CREDENTIALS_LEAKED_RESPONSE = "Your credentials have been LEAKED! Change your password!";
