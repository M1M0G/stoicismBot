import {Context, Markup, Telegraf} from 'telegraf';
import { Update } from 'typegram';
import {getTodayStoicismChapter} from "./parser";
import schedule from 'node-schedule'
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);
//-769764095
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

bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));