import FileDataManager, { FileData } from "./FileDataManager";

const fs = window.require('fs');

export interface WordGroupInfo {

    filename: string;
    name: string;
    description: string;

}

export interface WordGroup {

    info: WordGroupInfo;
    words: Word[];
    loaded: boolean;

}

export interface Word {

    word: string;
    definition: string;
    type: string;
    pronunciation?: string;

}

class WordGroupData extends FileData<WordGroup[]> {

    public getStringifiedData = (): string => {
        return JSON.stringify(this.getData().map((value: WordGroup) => value.info));
    }

    public parseData = (jsonString: string): WordGroup[] => {
        const data: any = JSON.parse(jsonString);
        if (data && typeof data.length === "number") {
            let wordGroups: WordGroup[] = [];
            for (let i: number = 0; i < data.length; i++) {
                if (typeof data[i].filename === "string" && typeof data[i].name === "string" && typeof data[i].description === "string") {
                    wordGroups.push({
                        info: {
                            filename: data[i].filename,
                            name: data[i].name,
                            description: data[i].description
                        },
                        words: [],
                        loaded: false
                    });
                } else {
                    throw new TypeError(`Object "${jsonString}" is not copatible with type`);
                }
            }
            return wordGroups;
        } else {
            throw new TypeError(`Object "${jsonString}" is not copatible with type`);
        }
    }

    public isValid(obj: any): obj is WordGroup[] {
        if (obj && typeof obj.length === "number") {
            for (let i: number = 0; i < obj.length; i++) {
                if (obj[i].words && typeof obj[i].words.length === "number") {
                    for (let j: number = 0; j < obj.words.length; j++) {
                        if (typeof obj[i].words[j].word !== "string" ||
                            typeof obj[i].words[j].definition !== "string" ||
                            typeof obj[i].words[j].type !== "string")
                            return false;
                    }
                } else {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    public createEmpty(): WordGroup[] {
        return [];
    }

}

export class WordGroupDataManager extends FileDataManager<WordGroup[]> {

    public constructor(params: { path: string, autosave?: boolean }) {
        super({
            ...params,
            fileData: new WordGroupData(),
            createIfNotExists: false
        });
    }

    public loadWords = (wordGroupIndex: number): void => {
        let data = this.getData();
        if (wordGroupIndex >= 0 && wordGroupIndex < data.length && !data[wordGroupIndex].loaded) {
            data[wordGroupIndex].words = JSON.parse(fs.readFileSync(`${this.getPath()}/../words/${data[wordGroupIndex].info.filename}`));
            console.log(data[wordGroupIndex].words);
            data[wordGroupIndex].loaded = true;
            this.setData(data);
        }
    }

}