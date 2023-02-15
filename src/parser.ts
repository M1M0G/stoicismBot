import {addDays, format} from "date-fns";
import {ru} from 'date-fns/locale'
import iconv from 'iconv-lite'
import * as fs from "fs";
import * as os from "os";

interface Quote {
    text: string,
    author: string
}

export interface TodayChapter {
    day: string;
    title: string;
    chapter: string;
    quote?: Quote,

}

export async function getTodayStoicismChapter(): Promise<TodayChapter> {
    const currentDate = format(new Date(), 'd MMMM', {locale: ru}).toUpperCase();
    const tomorrowDate = format(addDays(new Date(), 1), 'd MMMM', {locale: ru}).toUpperCase();


    return new Promise((resolve, reject) => {
        fs.readFile('./assets/data.txt', (error, data) => {
        if (error) {
            reject(error)
        }
        const ruData = iconv.decode(data, 'win1251')
        if(ruData.includes(currentDate) && ruData.includes(tomorrowDate)){
            const startIndex = ruData.indexOf(currentDate) + currentDate.length;
            const endIndex = ruData.indexOf(tomorrowDate);
            const substr = ruData.slice(startIndex, endIndex).replace(/\[(.*?)\]/g, '');
            const splitAndTrimmed = substr.split(os.EOL).filter(c => c !== '').map(c => c.trim())
            const chapter = splitAndTrimmed.slice(3, splitAndTrimmed.length - 1).join(' ')
            const quote = {
                text: splitAndTrimmed[1],
                author: splitAndTrimmed[2]
            }
            const title = splitAndTrimmed[0]

            resolve({day: currentDate, chapter, title, quote})
        }
        resolve({day: currentDate, title: "День X", chapter: "Увы, сегодня без стоицизма("})
        })
    });
}