import { nGrams } from "@/methods/guesser";
import { GuesserMethod, Password } from "..";
import { passwordsOfMethodAndVersion } from "./db/analysed-data";
import { isNumberStr } from "@/lib/password";

export async function calculateGuesserLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion("guesser", true);
    console.log(`AMOUN: ${guesserLeakedData.length}`);
    const stats: Record<string, number> = {};
    const statsMethod: Record<string, number> = {};
    let ngramsstart = 0;
    let ngramsend = 0;
    let start = 0;
    let end = 0;
    let numbers = 0;
    let spezials = 0;
    for (const { pw, originalVersion } of guesserLeakedData) {
        const guesser = new GuesserMethod(new Password(originalVersion));
        const creationMethod = guesser.fuzzingMethodOf(pw);
        if (creationMethod === "unknown") {
            // console.log("unknown", pw, originalVersion);
        }
        if (!stats[creationMethod]) {
            stats[creationMethod] = 0;
        }

        // if (creationMethod === "insert") {
        //     onIsInsert(statsInsert, pw, originalVersion);
        // }
        // if (creationMethod === "delete") {
        //     const removed = findFirstDiff(originalVersion, pw);
        //     if (isNumberStr(removed.diff)) numbers++;
        //     else spezials++;
        //     console.log(pw, originalVersion, removed);
        // }
        if (creationMethod === "leet") {
            onIsLeet(statsMethod, pw, originalVersion, true);
        }
        stats[creationMethod]++;
    }
    console.log(
        stats,
        // `ngramsstart: ${ngramsstart}; ngramsend: ${ngramsend} numbers: ${numbers} spezials: ${spezials} at start: ${start} at end: ${end}`,
    );
    console.table(Object.entries(statsMethod).sort((a, b) => b[1] - a[1]));
}
export async function calculateGuesserNotLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion("guesser", false);
    const stats: Record<string, number> = {};
    const statsMethod: Record<string, number> = {};
    for (const { pw, originalVersion } of guesserLeakedData) {
        if (!originalVersion) {
            throw new Error("originalVersion not found");
        }
        const guesser = new GuesserMethod(new Password(originalVersion));
        const creationMethod = guesser.fuzzingMethodOf(pw);
        // if (creationMethod === "unknown") {
        //      console.log("unknown", pw, originalVersion);
        // }
        // if (creationMethod === "insert") {
        //     onIsInsert(statsInsert, pw, originalVersion);
        // }
        if (creationMethod === "leet") {
            onIsLeet(statsMethod, pw, originalVersion, false);
        }
        if (!stats[creationMethod]) {
            stats[creationMethod] = 0;
        }
        stats[creationMethod]++;
    }
    console.log("final stats:");
    console.log(stats);
    console.table(Object.entries(statsMethod).sort((a, b) => b[1] - a[1]));
}
function findFirstDiff(base: string, baseWithDiff: string) {
    const indexOfDiff = [...base].findIndex((el, index) => el !== baseWithDiff[index]);
    const diff = baseWithDiff[indexOfDiff];
    if (diff === undefined) throw new Error("diff not found");
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
    const removed = findFirstDiff(originalVersion, pw).diff;
    if (!stats[removed]) stats[removed] = 0;
    stats[removed]++;
    if (isLeaked) {
        console.log(pw, originalVersion, removed);
    }
}
