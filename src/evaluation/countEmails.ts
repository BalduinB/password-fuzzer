import { isEmail } from "./helpers/validator";
import { basePathOfBreachData, getLinesOfFile, walkWhile } from "./fs";

let validEmails = 0;
let invalidEmails = 0;
let invalidLineFormat = 0;
main();
async function main() {
    walkWhile(basePathOfBreachData, () => true, analyseFile);
    console.log("DONE");
    console.log(`${validEmails} valide Emails`);
    console.log(`${invalidEmails} invalide Emails`);
    console.log(`${invalidLineFormat} invalide Lines`);
}

async function analyseFile(fileContent: string) {
    // Teile die Daten in Zeilen auf
    const lines = getLinesOfFile(fileContent);

    for (const line of lines) {
        const [email, password] = line.split(":");
        if (!email || !password) {
            invalidLineFormat++;
            continue;
        }
        if (!isEmail(email)) {
            invalidEmails++;
        } else validEmails++;
    }
    console.log("Processed 20000", {
        invalidEmails,
        invalidLineFormat,
        validEmails,
    });
}
