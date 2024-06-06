import { getBaseDataFromDB } from "./db/analysed-data";

export async function numberOfFindingsByPwType(version?: string) {
    const numberOfCredentialsWithFindings: Record<string, Record<string, number>> = {};
    const baseDataWithFuzzings = await getBaseDataFromDB(version, "ALL");
    for (const { fuzzedPasswords } of baseDataWithFuzzings) {
        const alreadyTrackedStack: Array<string> = [];

        const pwTypesAndVersionWithHits = fuzzedPasswords.reduce(
            (acc, { pwType, hit, version }) => {
                if (!hit) return acc;
                if (acc.some((item) => item.pwType === pwType && item.version === version))
                    return acc;

                acc.push({ pwType, version });
                return acc;
            },
            [] as Array<{ version: string; pwType: string }>,
        );
        for (const { pwType, version } of pwTypesAndVersionWithHits) {
            if (!numberOfCredentialsWithFindings[version]) {
                numberOfCredentialsWithFindings[version] = {};
            }
            if (!numberOfCredentialsWithFindings[version]?.[pwType]) {
                numberOfCredentialsWithFindings[version]![pwType] = 0;
            }
            numberOfCredentialsWithFindings[version]![pwType]++;
        }
        if (
            (fuzzedPasswords.some(({ pwType, hit }) => pwType === "tdt" && hit) ||
                fuzzedPasswords.some(({ pwType, hit }) => pwType === "guesser" && hit)) &&
            !alreadyTrackedStack.includes("tdt+guesser")
        ) {
            if (!numberOfCredentialsWithFindings["BASE"]) {
                numberOfCredentialsWithFindings["BASE"] = {};
            }
            if (!numberOfCredentialsWithFindings["BASE"]["tdt+guesser"]) {
                numberOfCredentialsWithFindings["BASE"]["tdt+guesser"] = 0;
            }
            numberOfCredentialsWithFindings["BASE"]["tdt+guesser"]++;
            alreadyTrackedStack.push("tdt+guesser");
        }
        // for (const { pwType, version, hit } of fuzzedPasswords) {
        //     if (alreadyTrackedStack.includes(pwType)) continue;

        //     if (!hit) continue;
        //     if (!numberOfCredentialsWithFindings[version]) {
        //         numberOfCredentialsWithFindings[version] = {};
        //     }
        //     if (!numberOfCredentialsWithFindings[version][pwType]) {
        //         numberOfCredentialsWithFindings[version][pwType] = 0;
        //     }
        //     numberOfCredentialsWithFindings[version][pwType]++;
        //     alreadyTrackedStack.push(pwType);
        // }
    }
    console.log("DONE");
    console.log(numberOfCredentialsWithFindings);
}
