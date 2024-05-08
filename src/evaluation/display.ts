import { calculateStatistics } from "./main";

export function displayStatistics(
    data: Array<{ method: string } & ReturnType<typeof calculateStatistics>[number]>,
) {
    console.table(data);
}
