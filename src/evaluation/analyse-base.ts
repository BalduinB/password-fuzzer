import { enshureKey } from "@/lib/objects";
import { upperFirst, upperFirstAndLast, upperLast } from "@/lib/string";

import { GuesserMethod, Password } from "..";
import { passwordsOfMethodAndVersion } from "./db/analysed-data";

export async function calculateGuesserLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion({
        version: "BASE",
        method: "guesser",
        isLeaked: true,
        type: "ALL",
    });
    console.log(`AMOUNT: ${guesserLeakedData.length}`);
    const statsGuesser: Record<string, number> = {};
    const statsOfMethod: Record<string, number> = {};

    for (const { pw, originalVersion, originalVersionId, pwType } of guesserLeakedData) {
        const guesser = new GuesserMethod(new Password(originalVersion));
        const guesserCreationMethod = guesser.fuzzingMethodOf(pw);
        enshureKey(statsGuesser, guesserCreationMethod);
        statsGuesser[guesserCreationMethod]++;

        if (guesserCreationMethod === "leet") {
            // console.log(originalVersion, pw);
        }
        if (guesserCreationMethod === "insert") {
            // onIsInsert(statsInsert, pw, originalVersion);
        }
        if (guesserCreationMethod === "delete") {
            // const removed = findFirstDiff(originalVersion, pw, "delete");
            // if (isNumberStr(removed.diff)) numbers++;
            // else if (isLetterOnly(removed.diff)) upper++;
            // else spezials++;
            // if (!isNumberStr(removed.diff) && !isLetterOnly(removed.diff)) {
            // console.log(pw, originalVersion, originalVersionId, removed);
            // }
        }
        if (guesserCreationMethod === "capitalize") {
            // onIsCapitalize(capitalizeStats, pw, originalVersion);
        }
        if (guesserCreationMethod === "moveSubString" || guesserCreationMethod === "unknown") {
            // const elements = calculateElements(originalVersion);
            // if (!statsOfMethod[elements.length]) statsOfMethod[elements.length] = 0;
            // statsOfMethod[elements.length]++;
            // console.log(pw, originalVersion, elements.length, guesserCreationMethod);
        }
        if (guesserCreationMethod === "keyboardSequenz") {
            // console.log(pw, originalVersion, calculateElements(pw).length);
        }
    }
    console.log("leaked BASE");
    console.log(statsOfMethod);
    console.table([statsGuesser]);
}
export async function calculateGuesserNotLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion({
        version: "BASE",
        method: "guesser",
        isLeaked: false,
        type: "ALL",
    });
    console.log(`AMOUNT: ${guesserLeakedData.length}`);
    const statsGuesser: Record<string, number> = {};
    const statsOfMethod: Record<string, number> = {};

    for (const { pw, originalVersion } of guesserLeakedData) {
        if (!originalVersion) throw new Error("originalVersion not found");

        const guesser = new GuesserMethod(new Password(originalVersion));
        const creationMethod = guesser.fuzzingMethodOf(pw);
        enshureKey(statsGuesser, creationMethod);
        statsGuesser[creationMethod]++;

        if (creationMethod === "leet") {
            // const diff = findFirstDiff(originalVersion, pw, "insert");
            // const prev = pw[diff.index - 1];
            // const next = pw[diff.index + 1];
            // if ((prev && !isLetterOnly(prev)) || (next && !isLetterOnly(next))) {
            //     enshureKey(statsOfMethod, "other");
            //     statsOfMethod.other++;
            // } else {
            //     enshureKey(statsOfMethod, "word");
            //     statsOfMethod.word++;
            // }
        }
        if (creationMethod === "insert") {
            //     onIsInsert(statsInsert, pw, originalVersion);
        }
        if (creationMethod === "leet") {
            // onIsLeet(statsOfMethod, pw, originalVersion, false);
        }
    }
    console.log("Not leaked BASE");
    console.table([statsGuesser]);
    // console.table([statsOfMethod]);
    // console.table(Object.entries(statsOfMethod).sort((a, b) => b[1] - a[1]));
}
function onIsCapitalize(stats: Record<string, number>, pw: string, originalVersion: string) {
    if (pw === originalVersion.toUpperCase()) {
        enshureKey(stats, "UPPER");
        stats.UPPER++;
    } else if (pw === upperFirst(originalVersion)) {
        enshureKey(stats, "Upper");
        stats.Upper++;
    } else if (pw === upperLast(originalVersion)) {
        enshureKey(stats, "uppeR");
        stats.uppeR++;
    } else if (pw === upperFirstAndLast(originalVersion)) {
        enshureKey(stats, "UpperR");
        stats.UppeR++;
    } else console.log(pw, originalVersion);
}
function findFirstDiff(base: string, baseWithDiff: string, type: "delete" | "insert") {
    const indexOfDiff = [...base].findIndex((el, index) => el !== baseWithDiff[index]);
    const diff = (type === "insert" ? baseWithDiff : base)[indexOfDiff];
    if (diff === undefined)
        throw new Error(`diff not found ${base} -> ${baseWithDiff} ${indexOfDiff}`);
    return { diff, index: indexOfDiff };
}

function onIsInsert(stats: Record<string, number>, pw: string, originalVersion: string) {
    const added = pw.replace(originalVersion, "");
    const location = pw.indexOf(added) !== 0 ? "end" : "start";

    const key = `${location} ${added}`;
    enshureKey(stats, key);
    stats[key]++;

    // if (nGrams.some((gram) => originalVersion + gram === pw)) {
    //     if (!stats.ngramsstart) stats.ngramsstart = 0;
    //     stats.ngramsstart++;
    // } else if (nGrams.some((gram) => gram + originalVersion === pw)) {
    //     if (!stats.ngramsend) stats.ngramsend = 0;
    //     stats.ngramsend++;
    // } else {
    //     if (isNumberStr(added)) {
    //         if (!stats.numbers) stats.numbers = 0;
    //         stats.numbers++;
    //     } else {
    //         if (!stats.spezials) stats.spezials = 0;
    //         stats.spezials++;
    //     }
    //     if (pw.indexOf(added) === 0) {
    //         if (!stats.start) stats.start = 0;
    //         stats.start++;
    //     } else {
    //         if (!stats.end) stats.end = 0;
    //         stats.end++;
    //     }

    //     console.log(pw, originalVersion, added);
    // }
}

function onIsLeet(
    stats: Record<string, number>,
    pw: string,
    originalVersion: string,
    isLeaked: boolean,
) {
    const removed = findFirstDiff(originalVersion, pw, "insert").diff;
    enshureKey(stats, removed);
    stats[removed]++;
    if (isLeaked) {
        console.log(pw, originalVersion, removed);
    }
}
