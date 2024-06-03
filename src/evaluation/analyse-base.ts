import { nGrams } from "@/methods/guesser";
import { GuesserMethod, OurMethod, Password } from "..";
import { passwordsOfMethodAndVersion } from "./db/analysed-data";
import { calculateElements, isNumberStr } from "@/lib/password";
import { isLetterOnly, upperFirst, upperFirstAndLast, upperLast } from "@/lib/string";

export async function calculateGuesserLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion({
        version: "BASE",
        method: "guesser",
        isLeaked: true,
        type: "ALL",
    });
    console.log(`AMOUNT: ${guesserLeakedData.length}`);
    const statsGuesser: Record<string, number> = {};
    const statsOur: Record<string, number> = {};
    const capitalizeStats = {
        UPPER: 0,
        Upper: 0,
        uppeR: 0,
        UppeR: 0,
    };
    const statsMethod: Record<string, number> = {};
    // let ngramsstart = 0;
    // let ngramsend = 0;
    // let start = 0;
    // let end = 0;
    // let numbers = 0;
    // let spezials = 0;
    // let upper = 0;
    const testpws = ["bob-marley10"];
    for (const { pw, originalVersion, originalVersionId, pwType } of guesserLeakedData) {
        const guesser = new GuesserMethod(new Password(originalVersion));
        const guesserCreationMethod = guesser.fuzzingMethodOf(pw);
        if (!statsGuesser[guesserCreationMethod]) {
            statsGuesser[guesserCreationMethod] = 0;
        }
        statsGuesser[guesserCreationMethod]++;

        // if (testpws.includes(originalVersion)) {
        //     console.log(pw, originalVersion, guesserCreationMethod, ourCreationMethod);
        // }
        if (guesserCreationMethod === "leet") {
            // console.log(originalVersion, pw);
        }
        // statsOur[ourCreationMethod]++;
        // if (creationMethod === "insert") {
        //     onIsInsert(statsInsert, pw, originalVersion);
        // }
        if (guesserCreationMethod === "delete") {
            const removed = findFirstDiff(originalVersion, pw, "delete");
            // if (isNumberStr(removed.diff)) numbers++;
            // else if (isLetterOnly(removed.diff)) upper++;
            // else spezials++;
            if (!isNumberStr(removed.diff) && !isLetterOnly(removed.diff)) {
                // console.log(pw, originalVersion, originalVersionId, removed);
            }
        }
        if (guesserCreationMethod === "capitalize") {
            // onIsCapitalize(capitalizeStats, pw, originalVersion);
            // if (pw === originalVersion.toUpperCase()) UPPER++;
            // else if (pw === upperFirst(originalVersion)) Upper++;
            // else if (pw === upperLast(originalVersion)) uppeR++;
            // else if (pw === upperFirstAndLast(originalVersion)) UppeR++;
            // else {
            //     console.log(pw, originalVersion);
            // }
        }
        if (guesserCreationMethod === "moveSubString" || guesserCreationMethod === "unknown") {
            // const elements = calculateElements(originalVersion);
            // if (!statsMethod[elements.length]) statsMethod[elements.length] = 0;
            // statsMethod[elements.length]++;
            // console.log(pw, originalVersion, elements.length, guesserCreationMethod);
        }
        if (guesserCreationMethod === "keyboardSequenz") {
            // console.log(pw, originalVersion, calculateElements(pw).length);
        }
    }
    console.log("leaked BASE");
    // console.log(statsMethod);
    console.table([statsGuesser]);
    // console.table([statsOur]);
    // console.log({
    //     UPPER,
    //     Upper,
    //     uppeR,
    //     UppeR,
    //     sum: UPPER + Upper + uppeR + UppeR,
    // });
    // console.log(`${numbers} Nummebr; ${spezials} Spezials; ${upper} Upper`);
    // console.table(Object.entries(statsMethod).sort((a, b) => b[1] - a[1]));
}
export async function calculateGuesserNotLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion({
        version: "BASE",
        method: "guesser",
        isLeaked: false,
        type: "ALL",
    });
    const stats: Record<string, number> = {};
    const statsMethod: Record<string, number> = {};
    for (const { pw, originalVersion } of guesserLeakedData) {
        if (!originalVersion) throw new Error("originalVersion not found");

        const guesser = new GuesserMethod(new Password(originalVersion));
        const creationMethod = guesser.fuzzingMethodOf(pw);
        if (!stats[creationMethod]) {
            stats[creationMethod] = 0;
        }
        stats[creationMethod]++;

        if (creationMethod === "leet") {
            // const diff = findFirstDiff(originalVersion, pw, "insert");
            // const prev = pw[diff.index - 1];
            // const next = pw[diff.index + 1];
            // if ((prev && !isLetterOnly(prev)) || (next && !isLetterOnly(next))) {
            //     if (!statsMethod.other) statsMethod.other = 0;
            //     statsMethod.other++;
            // } else {
            //     if (!statsMethod.word) statsMethod.word = 0;
            //     statsMethod.word++;
            // }
        }
        // if (creationMethod === "insert") {
        //     onIsInsert(statsInsert, pw, originalVersion);
        // }
        if (creationMethod === "leet") {
            // onIsLeet(statsMethod, pw, originalVersion, false);
        }
    }
    console.log("Not leaked BASE");
    console.table([stats]);
    // console.table([statsMethod]);
    // console.table(Object.entries(statsMethod).sort((a, b) => b[1] - a[1]));
}
function onIsCapitalize(
    stats: {
        UPPER: number;
        Upper: number;
        uppeR: number;
        UppeR: number;
    },
    pw: string,
    originalVersion: string,
) {
    if (pw === originalVersion.toUpperCase()) stats.UPPER++;
    else if (pw === upperFirst(originalVersion)) stats.Upper++;
    else if (pw === upperLast(originalVersion)) stats.uppeR++;
    else if (pw === upperFirstAndLast(originalVersion)) stats.UppeR++;
    else console.log(pw, originalVersion);
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
    // if (nGrams.some((gram) => originalVersion + gram === pw)) {
    //     if (!stats.ngramsstart) stats.ngramsstart = 0;
    //     stats.ngramsstart++;
    // } else if (nGrams.some((gram) => gram + originalVersion === pw)) {
    //     if (!stats.ngramsend) stats.ngramsend = 0;
    //     stats.ngramsend++;
    // } else {
    const key = `${location} ${added}`;
    if (!stats[key]) stats[key] = 0;
    stats[key]++;

    // if (isNumberStr(added)) {
    //     if (!stats.numbers) stats.numbers = 0;
    //     stats.numbers++;
    // } else {
    //     if (!stats.spezials) stats.spezials = 0;
    //     stats.spezials++;
    // }
    // if (pw.indexOf(added) === 0) {
    //     if (!stats.start) stats.start = 0;
    //     stats.start++;
    // } else {
    //     if (!stats.end) stats.end = 0;
    //     stats.end++;
    // }

    // console.log(pw, originalVersion, added);
    // }
}

function onIsLeet(
    stats: Record<string, number>,
    pw: string,
    originalVersion: string,
    isLeaked: boolean,
) {
    const removed = findFirstDiff(originalVersion, pw, "insert").diff;
    if (!stats[removed]) stats[removed] = 0;
    stats[removed]++;
    if (isLeaked) {
        console.log(pw, originalVersion, removed);
    }
}
