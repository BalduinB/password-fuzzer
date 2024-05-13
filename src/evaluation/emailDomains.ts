import { isEmail } from "./helpers/validator";
import { basePathOfBreachData, getLinesOfFile, parseLine, walkWhile } from "./fs";
import { fNumber } from "./helpers/formaters";

let totalLines = 0;
let invalidLineFormat = 0;
let numberOfFiles = 0;
let invalidDomains = 0;

const domainsMap = new Map<string, number>();
main();
async function main() {
    await walkWhile(basePathOfBreachData, () => true, analyseFile);
    console.log("DONE");
    console.log(`${invalidLineFormat} invalide Lines`);
    console.log(`${invalidDomains} invalide Domains`);
    console.log(`${totalLines} total Lines`);
    console.table(
        Array.from(domainsMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 25),
    );
}

async function analyseFile(fileContent: string) {
    const lines = getLinesOfFile(fileContent);
    console.log("lines", fNumber(lines.length));
    numberOfFiles++;
    totalLines += lines.length;
    for (const line of lines) {
        const [email, password] = parseLine(line);
        if (!email || !password) {
            invalidLineFormat++;
            continue;
        }
        if (isEmail(email)) {
            const domain = email.split("@")[1];
            if (!domain) {
                invalidDomains++;
                continue;
            }
            const count = domainsMap.get(domain);
            if (count) domainsMap.set(domain, count + 1);
            else if (totalLines < 50_000_000) domainsMap.set(domain, 1); // cap new domains
        }
    }

    if (numberOfFiles % 50 === 0) {
        console.log("Processed 20000", {
            numberOfFiles,
            totalLines,
            invalidLineFormat,
            invalidDomains,
        });
        console.table(
            Array.from(domainsMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
        );
    }
}
