import { enshureKey } from "@/lib/objects";
import { isNumberStr } from "@/lib/password";
import { onlyFirstCharUpper, upperFirst, upperFirstAndLast, upperLast } from "@/lib/string";
import { nGrams } from "@/methods/guesser";
import { OurMethod } from "@/methods/our-v1";
import { Password } from "@/password";

import { passwordsOfMethodAndVersion } from "./db/analysed-data";

export async function calculateGuesserLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion({
        method: "our",
        isLeaked: true,
        type: "ALL",
        version: "V1",
    });
    console.log(`AMOUNT: ${guesserLeakedData.length}`);
    const statsOur: Record<string, number> = {};
    const statsOfMethod: Record<string, number> = {};

    for (const { pw, originalVersion } of guesserLeakedData) {
        const our = new OurMethod(new Password(originalVersion));
        const creationMethodOfPW = our.fuzzingMethodOf(pw);

        enshureKey(statsOur, creationMethodOfPW);
        statsOur[creationMethodOfPW]++;

        if (creationMethodOfPW === "unknown") {
            // console.log(originalVersion + " -> " + pw + ": " + pw.replace(originalVersion, ""));
        }
        if (creationMethodOfPW === "casing") {
            // onIsCapitalize(statsOfMethod, pw, originalVersion);
        }
        if (creationMethodOfPW === "insert") {
            // onIsInsert(statsOfMethod, pw, originalVersion);
        }
        if (creationMethodOfPW === "moveSubString") {
            // console.log(pw, originalVersion, calculateElements(pw).length);
        }
        if (creationMethodOfPW === "postfixes") {
            // console.log(pw, originalVersion, calculateElements(pw).length);
        }
        if (creationMethodOfPW === "capAndNumber") {
            // console.log(pw, originalVersion, calculateElements(originalVersion).length);
        }
        if (creationMethodOfPW === "delete") {
            // const removed = findFirstDiff(originalVersion, pw);
            // if (isNumberStr(removed.diff)) numbers++;
            // else spezials++;
            // console.log(pw, originalVersion, removed);
        }
        if (creationMethodOfPW === "leet") {
            // onIsLeet(statsOfMethod, pw, originalVersion, true);
        }
    }
    console.log("leaked V1:");
    console.table([statsOur]);
    // console.table([statsOfMethod]);
    // console.table(Object.entries(statsOfMethod).sort((a, b) => b[1] - a[1]));
}

export async function calculateGuesserNotLeakedStats() {
    const notLeakedData = await passwordsOfMethodAndVersion({
        method: "our",
        isLeaked: false,
        type: "ALL",
        version: "V1",
    });
    const statsOfMethod: Record<string, number> = {};
    const statsOur: Record<string, number> = {};

    for (const { pw, originalVersion } of notLeakedData) {
        if (!originalVersion) {
            throw new Error("originalVersion not found");
        }
        const our = new OurMethod(new Password(originalVersion));
        const creationMethodOfPW = our.fuzzingMethodOf(pw);
        enshureKey(statsOur, creationMethodOfPW);
        statsOur[creationMethodOfPW]++;

        if (creationMethodOfPW === "casing") {
            // onIsCapitalize(statsOfMethod, pw, originalVersion);
        }

        if (creationMethodOfPW === "leet") {
            // console.log(
            //     originalVersion + " -> " + pw + ": " + findFirstDiff(originalVersion, pw).diff,
            // );
        }
        if (creationMethodOfPW === "unknown") {
            //  console.log("unknown", pw, originalVersion);
        }
        if (creationMethodOfPW === "insert") {
            // onIsInsert(statsOfMethod, pw, originalVersion);
        }
        if (creationMethodOfPW === "leet") {
            // onIsLeet(statsOfMethod, pw, originalVersion, false);
        }
    }
    console.log("not leaked V1:");
    // console.table([statsGuesser]);
    console.table([statsOur]);
    // console.table([statsOfMethod]);

    // console.log("final stats:");
    // console.log(stats);
    // console.table(Object.entries(statsOfMethod).sort((a, b) => b[1] - a[1]));
}

function onIsCapitalize(
    stats: Record<string, number>,
    pw: string,
    originalVersion: string,
    isLeaked: boolean = false,
) {
    if (pw === originalVersion.toUpperCase()) {
        enshureKey(stats, "UPPER");
        stats.UPPER++;
    } else if (pw === originalVersion.toLowerCase()) {
        enshureKey(stats, "lower");
        stats.lower++;
    } else if (pw === upperFirst(originalVersion)) {
        enshureKey(stats, "Upper");
        stats.Upper++;
    } else if (pw === onlyFirstCharUpper(originalVersion)) {
        enshureKey(stats, "onlyFirst");
        stats.onlyFirst++;
    } else if (pw === upperLast(originalVersion)) {
        enshureKey(stats, "uppeR");
        stats.uppeR++;
    } else if (pw === upperFirstAndLast(originalVersion)) {
        enshureKey(stats, "UppeR");
        stats.UppeR++;
    } else {
        stats.unknown++;
        if (isLeaked) console.log(pw, originalVersion);
    }
}

function findFirstDiff(base: string, baseWithDiff: string) {
    const indexOfDiff = [...base].findIndex((el, index) => el !== baseWithDiff[index]);
    const diff = baseWithDiff[indexOfDiff];
    if (diff === undefined) throw new Error("diff not found");
    return { diff, index: indexOfDiff };
}

function onIsInsert(stats: Record<string, number>, pw: string, originalVersion: string) {
    const added = pw.replace(originalVersion, "");
    // const key = `${added}`;
    // if (!stats[key]) stats[key] = 0;
    // stats[key]++;

    if (nGrams.some((gram) => originalVersion + gram === pw)) {
        enshureKey(stats, "ngramsstart");
        stats.ngramsstart++;
    } else if (nGrams.some((gram) => gram + originalVersion === pw)) {
        enshureKey(stats, "ngramsend");
        stats.ngramsend++;
    } else {
        if (isNumberStr(added)) {
            enshureKey(stats, "numbers");
            stats.numbers++;
        } else {
            enshureKey(stats, "spezials");
            stats.spezials++;
        }
        if (pw.indexOf(added) === 0) {
            enshureKey(stats, "start");
            stats.start++;
        } else {
            enshureKey(stats, "end");
            stats.end++;
        }

        console.log(pw, originalVersion, added);
    }
}

function onIsLeet(
    stats: Record<string, number>,
    pw: string,
    originalVersion: string,
    isLeaked: boolean,
) {
    const removed = findFirstDiff(originalVersion, pw).diff;
    enshureKey(stats, removed);
    stats[removed]++;
    if (isLeaked) {
        console.log(pw, originalVersion, removed);
    }
}
