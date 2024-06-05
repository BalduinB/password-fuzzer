import { numberOfFindingsByPwType } from "./account-data-with-findings";
import {
    calculateGuesserLeakedStats as baseLeaked,
    calculateGuesserNotLeakedStats as baseNotLeaked,
} from "./analyse-base";
import {
    calculateGuesserLeakedStats as v1Leaked,
    calculateGuesserNotLeakedStats as v1NotLeaked,
} from "./analyse-v1";
import {
    calculateGuesserLeakedStats as v2Leaked,
    calculateGuesserNotLeakedStats as v2NotLeaked,
} from "./analyse-v2";
import { main } from "./main";

// baseLeaked();
// baseNotLeaked();
// v1Leaked();
// v1NotLeaked();
// v2Leaked();
// v2NotLeaked();
// await main();

numberOfFindingsByPwType();

export {};
