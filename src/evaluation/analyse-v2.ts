import { nGrams } from "@/methods/guesser";
import { Password } from "..";
import { passwordsOfMethodAndVersion } from "./db/analysed-data";
import { calculateElements, isNumberStr } from "@/lib/password";
import { onlyFirstCharUpper, upperFirst, upperFirstAndLast, upperLast } from "@/lib/string";
import { OurMethod } from "@/methods/our";

const testpws = ["bob-marley10", ""];

export async function calculateGuesserLeakedStats() {
    const guesserLeakedData = await passwordsOfMethodAndVersion({
        method: "our",
        isLeaked: true,
        type: "ALL",
        version: "V2",
    });
    console.log(`AMOUNT: ${guesserLeakedData.length}`);
    const statsOur: Record<string, number> = {};
    const statsMethod: Record<string, number> = {};
    // let ngramsstart = 0;
    // let ngramsend = 0;
    // let start = 0;
    // let end = 0;
    // let numbers = 0;
    // let spezials = 0;
    const capitalizeStats = {
        UPPER: 0,
        Upper: 0,
        uppeR: 0,
        UppeR: 0,
        lower: 0,
        onlyFirst: 0,
        unknown: 0,
    };
    for (const { pw, originalVersion } of guesserLeakedData) {
        const our = new OurMethod(new Password(originalVersion));
        const ourCreationMethod = our.fuzzingMethodOf(pw);
        if (!statsOur[ourCreationMethod]) {
            statsOur[ourCreationMethod] = 0;
        }
        statsOur[ourCreationMethod]++;

        // if (testpws.includes(originalVersion)) {
        //     console.log(pw, originalVersion, ourCreationMethod);
        // }

        if (ourCreationMethod === "unknown") {
            // console.log(originalVersion + " -> " + pw + ": " + pw.replace(originalVersion, ""));
        }
        if (ourCreationMethod === "casing") {
            // onIsCapitalize(capitalizeStats, pw, originalVersion);
        }
        if (ourCreationMethod === "insert") {
            // onIsInsert(statsMethod, pw, originalVersion);
        }
        if (ourCreationMethod === "moveSubString") {
            // console.log(pw, originalVersion, calculateElements(pw).length);
        }
        if (ourCreationMethod === "capAndNumber") {
            // console.log(pw, originalVersion, calculateElements(originalVersion).length);
        }
        // if (creationMethod === "delete") {
        //     const removed = findFirstDiff(originalVersion, pw);
        //     if (isNumberStr(removed.diff)) numbers++;
        //     else spezials++;
        //     console.log(pw, originalVersion, removed);
        // }
        // if (ourCreationMethod === "leet") {
        //     onIsLeet(statsMethod, pw, originalVersion, true);
        // }
    }
    console.log("leaked v2:");
    console.table([statsOur]);
    // console.table([statsMethod]);

    // console.table(Object.entries(statsMethod).sort((a, b) => b[1] - a[1]));
}

function onIsCapitalize(
    stats: {
        UPPER: number;
        Upper: number;
        uppeR: number;
        UppeR: number;
        lower: number;
        onlyFirst: number;
        unknown: number;
    },
    pw: string,
    originalVersion: string,
    isLeaked: boolean = false,
) {
    if (pw === originalVersion.toUpperCase()) stats.UPPER++;
    else if (pw === originalVersion.toLowerCase()) stats.lower++;
    else if (pw === upperFirst(originalVersion)) stats.Upper++;
    else if (pw === onlyFirstCharUpper(originalVersion)) stats.onlyFirst++;
    else if (pw === upperLast(originalVersion)) stats.uppeR++;
    else if (pw === upperFirstAndLast(originalVersion)) stats.UppeR++;
    else {
        stats.unknown++;
        if (isLeaked) console.log(pw, originalVersion);
    }
}
export async function calculateGuesserNotLeakedStats() {
    const notLeakedData = await passwordsOfMethodAndVersion({
        method: "our",
        isLeaked: false,
        type: "ALL",
        version: "V2",
    });
    const stats: Record<string, number> = {};
    const statsMethod: Record<string, number> = {};
    const statsOur: Record<string, number> = {};
    const capitalizeStats = {
        UPPER: 0,
        Upper: 0,
        uppeR: 0,
        UppeR: 0,
        lower: 0,
        onlyFirst: 0,
        unknown: 0,
    };
    for (const { pw, originalVersion } of notLeakedData) {
        if (!originalVersion) {
            throw new Error("originalVersion not found");
        }
        const our = new OurMethod(new Password(originalVersion));
        const ourCreationMethod = our.fuzzingMethodOf(pw);
        if (!statsOur[ourCreationMethod]) {
            statsOur[ourCreationMethod] = 0;
        }
        statsOur[ourCreationMethod]++;

        if (ourCreationMethod === "casing") {
            // onIsCapitalize(capitalizeStats, pw, originalVersion);
        }
        // if (testpws.includes(pw)) {
        //     console.log(pw, originalVersion, ourCreationMethod);
        // }

        // if (ourCreationMethod === "leet") {
        //     console.log(
        //         originalVersion + " -> " + pw + ": " + findFirstDiff(originalVersion, pw).diff,
        //     );

        // }
        // if (creationMethod === "unknown") {
        //      console.log("unknown", pw, originalVersion);
        // }
        if (ourCreationMethod === "insert") {
            // onIsInsert(statsMethod, pw, originalVersion);
        }
        if (ourCreationMethod === "leet") {
            // onIsLeet(statsMethod, pw, originalVersion, false);
        }
    }
    console.log("not leaked v2:");
    // console.table([statsGuesser]);
    console.table([statsOur]);
    console.table([statsMethod]);

    // console.log("final stats:");
    // console.log(stats);
    // console.table(Object.entries(statsMethod).sort((a, b) => b[1] - a[1]));
}
function findFirstDiff(base: string, baseWithDiff: string) {
    const indexOfDiff = [...base.split("")].findIndex((el, index) => el !== baseWithDiff[index]);
    const diff = baseWithDiff[indexOfDiff];
    if (diff === undefined) throw new Error("diff not found");
    return { diff, index: indexOfDiff };
}

function onIsInsert(stats: Record<string, number>, pw: string, originalVersion: string) {
    const added = pw.replace(originalVersion, "");
    // if (nGrams.some((gram) => originalVersion + gram === pw)) {
    //     if (!stats.ngramsstart) stats.ngramsstart = 0;
    //     stats.ngramsstart++;
    // } else if (nGrams.some((gram) => gram + originalVersion === pw)) {
    //     if (!stats.ngramsend) stats.ngramsend = 0;
    //     stats.ngramsend++;
    // } else {
    const key = `${added}`;
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
