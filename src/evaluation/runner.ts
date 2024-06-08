import { numberOfFindingsByPwType } from "./analyse/account-data-with-findings";
import {
    calculateGuesserLeakedStats as baseLeaked,
    calculateGuesserNotLeakedStats as baseNotLeaked,
} from "./analyse/analyse-base";
import {
    calculateGuesserLeakedStats as v1Leaked,
    calculateGuesserNotLeakedStats as v1NotLeaked,
} from "./analyse/analyse-v1";
import {
    calculateGuesserLeakedStats as v2Leaked,
    calculateGuesserNotLeakedStats as v2NotLeaked,
} from "./analyse/analyse-v2";
import { main as base } from "./steps/base/main";
import { main as v1 } from "./steps/v1/main";
import { main as v2 } from "./steps/v2/main";

// baseLeaked();
// baseNotLeaked();
// v1Leaked();
// v1NotLeaked();
// v2Leaked();
// v2NotLeaked();

numberOfFindingsByPwType();

export {};
