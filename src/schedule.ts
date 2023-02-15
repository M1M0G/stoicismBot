import schedule from "node-schedule";

const rule = new schedule.RecurrenceRule();
rule.hour = 8;
rule.minute = 30;
rule.tz = 'Asia/Yekaterinburg';


export function scheduleChapter(func: () => Promise<void>) {
    return schedule.scheduleJob(rule, async () => await func());
}