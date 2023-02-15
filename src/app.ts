import {Context, Telegraf} from 'telegraf';
import {Update} from 'typegram';
import {getTodayStoicismChapter, TodayChapter} from "./parser";
import schedule from 'node-schedule'
import * as http from "http";
import {scheduleChapter} from "./schedule";
import * as crypto from "crypto";

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN);
let job:  schedule.Job | undefined;
bot.start(async (ctx) => {
    ctx.reply('Ку в этом чатике');
});

function buildMessage(todayChapter: TodayChapter) {
    return `<strong> [ ${todayChapter.day} ]   ${todayChapter.title}</strong> \n\n<i>${todayChapter.quote?.text}</i> \n${todayChapter.quote?.author} \n\n${todayChapter.chapter}`
}

async function sendChapter() {
    const todayChapter = await getTodayStoicismChapter();
    await bot.telegram.sendMessage(process.env.CHAT_ID, buildMessage(todayChapter), {parse_mode: "HTML"})
}

bot.command('/stop_sending', (ctx) => {
    job?.cancel();
    job = undefined;
    ctx.reply('Останавливаю рассылку')
})

bot.command('/start_sending', (ctx) => {
    if (!job) {
        job = scheduleChapter(sendChapter);
        job.getMaxListeners()
        ctx.reply('Запускаю расписание рассылки')
    } else {
        ctx.reply('расписание рассылки уже запущено')
    }
})

bot.help((ctx => {
    ctx.reply(`Отправьте /start чтобы начать использовать \nОтправьте /stop_sending чтобы остановить рассылку \nОтправьте /start_sending чтобы остановить рассылку \nОтправьте /send_chapter чтобы получить порцию стоицизма на сегодня`, {parse_mode: 'HTML'});
}));

bot.command('/send_chapter', async (ctx) => {
    const todayChapter = await getTodayStoicismChapter();
    ctx.reply(buildMessage(todayChapter), {parse_mode: "HTML"} )
})

bot.launch({
    webhook: {
        // Public domain for webhook; e.g.: example.com
        domain: process.env.WEBHOOK_DOMAIN || 'localhost',

        // Port to listen on; e.g.: 8080
        port: process.env.PORT || 4000,

        // Optional secret to be sent back in a header for security.
        // e.g.: `crypto.randomBytes(64).toString("hex")`
        secretToken: crypto.randomBytes(64).toString("hex"),
    },
});

http.createServer()

process.once('SIGINT', () => {
    bot.stop('SIGINT');
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})