import { isEmail } from "./helpers/validator";
import { basePathOfBreachData, getLinesOfFile, parseLine, walkWhile } from "./fs";

let validEmails = 0;
let invalidEmails = 0;
let totalLines = 0;
let invalidLineFormat = 0;
let numberOfFiles = 0;
export async function countEmails() {
    await walkWhile(basePathOfBreachData, () => true, analyseFile);
    console.log("DONE");
    console.log(`${validEmails} valide Emails`);
    console.log(`${invalidEmails} invalide Emails`);
    console.log(`${invalidLineFormat} invalide Lines`);
    console.log(`${totalLines} total Lines`);
}

async function analyseFile(fileContent: string) {
    const lines = getLinesOfFile(fileContent);
    numberOfFiles++;
    totalLines += lines.length;
    for (const line of lines) {
        const [email, password] = parseLine(line);
        if (!email || !password) {
            invalidLineFormat++;
            continue;
        }
        if (isEmail(email)) validEmails++;
        else invalidEmails++;
    }
    if (numberOfFiles % 50 === 0)
        console.log("Processed 20000", {
            numberOfFiles,
            invalidEmails,
            totalLines,
            invalidLineFormat,
            validEmails,
        });
}
