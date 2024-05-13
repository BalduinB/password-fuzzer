import { calculateStatistics } from "./main";

export function displayFuzzerStatistics(
    data: Array<{ method: string } & ReturnType<typeof calculateStatistics>[number]>,
) {
    console.table(data);
}
