import axios from 'axios'
import { word2typeAlias } from './WordTypes';
import { Word } from './WordGroup';

export async function getAutofillValues(word: string): Promise<Partial<Word>> {

    const out = (await axios.get("https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=" + word.replace(" ", "+"))).data;

    const doc = new DOMParser().parseFromString(out, "text/html");

    if (doc.querySelector(".headword")) {
        return {
            definition: (doc.querySelector(".def") as HTMLElement)?.innerText,
            pronunciation: (doc.querySelector(".phon") as HTMLElement)?.innerText,
            type: (word2typeAlias as any)[(doc.querySelector(".pos") as HTMLElement)?.innerText ?? "UNKNWN"] ?? "UNKNWN"
        };
    } else {
        return {

        };
    }
}