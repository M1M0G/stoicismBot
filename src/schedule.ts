import schedule from "node-schedule";

export function scheduleChapter(func: () => void) {
    return schedule.scheduleJob('0 29 4 * * *', async () => func());
}