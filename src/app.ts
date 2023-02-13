import {Context, Telegraf} from 'telegraf';
import {Update} from 'typegram';
import {getTodayStoicismChapter} from "./parser";
import schedule from 'node-schedule'
import * as http from "http";
import * as crypto from "crypto";
import {scheduleChapter} from "./schedule";

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN);
let job:  schedule.Job | undefined;
bot.start(async (ctx) => {
    ctx.reply('Ку в этом чатике');
});

async function sendChapter() {
    const todayChapter = await getTodayStoicismChapter();
    await bot.telegram.sendMessage(process.env.CHAT_ID, `<strong>${todayChapter.day}</strong> ${todayChapter.chapter}`, {parse_mode: "HTML"})
}

bot.command('/stop_sending', (ctx) => {
    job?.cancel();
    ctx.reply('Останавливаю рассылку')
})

bot.command('/start_sending', (ctx) => {
    job = scheduleChapter(sendChapter);
    ctx.reply('Запускаю расписание рассылки')
})

bot.help((ctx => {
    ctx.reply('Отправьте /start чтобы начать использовать');
    ctx.reply('Отправьте /stop_sending чтобы остановить рассылку')
    ctx.reply('Отправьте /start_sending чтобы остановить рассылку')
}));

if (process.env.PROD === true) {
    bot.launch( {
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
} else {
    console.log('DEV')
    bot.launch()
}

http.createServer()

process.once('SIGINT', () => {
    bot.stop('SIGINT');
    job?.cancel()
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    job?.cancel();
});