import {addDays, format} from "date-fns";
import {ru} from 'date-fns/locale'
import iconv from 'iconv-lite'
import * as fs from "fs";

export async function getTodayStoicismChapter(): Promise<{day: string, chapter: string}> {
    const currentDate = format(new Date(), 'd MMMM', {locale: ru}).toUpperCase();
    const tomorrowDate = format(addDays(new Date(), 1), 'd MMMM', {locale: ru}).toUpperCase();


    return new Promise((resolve, reject) => {
        fs.readFile('./assets/data.txt', (error, data) => {
        if (error) {
            reject(error)
        }
        console.log(data)
        const ruData = iconv.decode(data, 'win1251')
        if(ruData.includes(currentDate) && ruData.includes(tomorrowDate)){
            const startIndex = ruData.indexOf(currentDate) + currentDate.length;
            const endIndex = ruData.indexOf(tomorrowDate);
            const substr = ruData.slice(startIndex, endIndex);
            const chapter = substr.replace(/\[(.*?)\]/g, '')
            resolve({day: currentDate, chapter})
        }
        resolve({day: currentDate, chapter: "Увы, сегодня без стоицизма("})
        })
    });
}