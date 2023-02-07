import {addDays, format} from "date-fns";
import {ru} from 'date-fns/locale'
import iconv from 'iconv-lite'
import * as fs from "fs";

export async function getTodayStoicismChapter(): Promise<{day: string, chapter: string, annotations?: string}> {
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
            const annotations = parseSquareBrackets(substr);
            const chapter = substr.replace(/\[(.*?)\]/g, '')
            resolve({day: currentDate, chapter, annotations})
        }
        resolve({day: currentDate, chapter: "Увы, сегодня без стоицизма("})
        })
    });
}

function parseSquareBrackets(text: string) {
    const matches = text.match(/\[(.*?)\]/g);
    const result = [];
    if (matches) {
        for (let i = 0; i < matches.length; ++i) {
            const match = matches[i];
            result.push(match.substring(1, match.length - 1).trim());  // brackets removing
        }
    }
    return result.join('\n');
}