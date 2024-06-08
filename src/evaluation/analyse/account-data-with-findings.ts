import { enshureKey } from "@/lib/objects";

import { getBaseDataFromDB } from "../db/analysed-data";

export async function numberOfFindingsByPwType(version?: string) {
    const numberOfCredentialsWithFindings: Record<string, Record<string, number>> = {};
    const baseDataWithFuzzings = await getBaseDataFromDB(version, "ALL");
    for (const { fuzzedPasswords } of baseDataWithFuzzings) {
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
            enshureKey(numberOfCredentialsWithFindings[version]!, pwType);
            numberOfCredentialsWithFindings[version]![pwType]++;
        }
    }
    console.log("DONE");
    console.log(numberOfCredentialsWithFindings);
}
