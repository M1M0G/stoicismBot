import {Context, Markup, Telegraf} from 'telegraf';
import { Update } from 'typegram';
import {getTodayStoicismChapter} from "./parser";
import schedule from 'node-schedule'
import * as http from "http";
import * as crypto from "crypto";
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);

bot.start(async (ctx) => {
    ctx.reply('Ку в этом чатике');
    schedule.scheduleJob('* * 8 * * *', async () => {
        const todayChapter = await getTodayStoicismChapter();
        await bot.telegram.sendMessage(process.env.CHAT_ID as string, `<strong>${todayChapter.day}</strong> ${todayChapter.chapter}`, {parse_mode: "HTML"})
    })
});

bot.help((ctx) => {
    ctx.reply('Send /start to receive a greeting');
});

bot.launch( {
    webhook: {
        // Public domain for webhook; e.g.: example.com
        domain: process.env.WEBHOOK_DOMAIN || 'localhost',

        // Port to listen on; e.g.: 8080
        port: process.env.PORT || 8080,

        // Optional secret to be sent back in a header for security.
        // e.g.: `crypto.randomBytes(64).toString("hex")`
        secretToken: crypto.randomBytes(64).toString("hex"),
    },
});
http.createServer()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));