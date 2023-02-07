import {Context, Markup, Telegraf} from 'telegraf';
import { Update } from 'typegram';
import {getTodayStoicismChapter} from "./parser";
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);


let timer = null;
//
// bot.onText(/\/start/, message => {
//     timer = setInterval(() => {
//         if(new Date().getSeconds() === 1) {
//             bot.sendMessage(message.chat.id, "responce");
//         }
//     }, 1000)
// });
//
// bot.onText(/\/stop/, message => {
//     clearInterval(timer);
// })
// getTodayStoicismChapter().then((data) => console.log(data));
getTodayStoicismChapter().then((data)=> {console.log(data)});


bot.start(async (ctx) => {
    ctx.reply('Ку в этом чатике');
    // timer = setInterval(async () => {
        // if(new Date().getSeconds() === 1) {
            const todayChapter = await getTodayStoicismChapter();
            await bot.telegram.sendMessage(424634387, `<strong>${todayChapter.day}</strong> ${todayChapter.chapter}  <i>${todayChapter.annotations}</i>`, {parse_mode: "HTML"})
        // }
    // }, 10000)
});
bot.help((ctx) => {
    ctx.reply('Send /start to receive a greeting');
    ctx.reply('Send /keyboard to receive a message with a keyboard');
    ctx.reply('Send /quit to stop the bot');
});
// bot.command('quit', (ctx) => {
//     // Explicit usage
//     ctx.telegram.leaveChat(ctx.message.chat.id);
// // Context shortcut
//     ctx.leaveChat();
// });
// bot.command('keyboard', (ctx) => {
//     ctx.reply(
//         'Keyboard',
//         Markup.inlineKeyboard([
//             Markup.button.callback('First option', 'first'),
//             Markup.button.callback('Second option', 'second'),
//         ])
//     );
// });
// bot.on('text', (ctx) => {
//     ctx.reply(
//         'You choose the ' +
//         (ctx.message.text === 'first' ? 'First' : 'Second') +
//         ' Option!'
//     );
// });


// bot.on('message', (ctx) => {
//     const html = `
//     <strong></strong>
//     Дневники одного из величайших императоров Рима, личные письма одного из лучших драматургов и политических деятелей Рима, лекции бывшего раба и изгнанника, ставшего известным учителем, – невероятные документы. Они сохранились, несмотря на все превратности двух прошедших тысячелетий.
//
// О чем они нам говорят? Может ли на этих старых и неясных страницах находиться то, что относится к современной жизни? Ответ: да. Эти страницы содержат величайшую мудрость в мировой истории.
//
// Вместе они являются краеугольным камнем того, что известно под названием «стоицизм», – античной философии, которая когда-то была одной из самых популярных дисциплин на Западе, привлекавшей и бедных, и богатых, и стремящихся к добру. Однако с ходом веков такой образ мышления, некогда важный для столь многих, стал постепенно исчезать.
//     `
//     ctx.reply(html, {parse_mode: 'HTML'})
// })


bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));