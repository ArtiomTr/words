import FileDataManager, { FileData } from './FileDataManager';

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
        return JSON.stringify(
            this.getData().map((value: WordGroup) => value.info)
        );
    };

    public parseData = (jsonString: string): WordGroup[] => {
        const data: any = JSON.parse(jsonString);
        if (data && typeof data.length === 'number') {
            let wordGroups: WordGroup[] = [];
            for (let i: number = 0; i < data.length; i++) {
                if (
                    typeof data[i].filename === 'string' &&
                    typeof data[i].name === 'string' &&
                    typeof data[i].description === 'string'
                ) {
                    wordGroups.push({
                        info: {
                            filename: data[i].filename,
                            name: data[i].name,
                            description: data[i].description,
                        },
                        words: [],
                        loaded: false,
                    });
                } else {
                    throw new TypeError(
                        `Object "${jsonString}" is not copatible with type`
                    );
                }
            }
            return wordGroups;
        } else {
            throw new TypeError(
                `Object "${jsonString}" is not copatible with type`
            );
        }
    };

    public isValid(obj: any): obj is WordGroup[] {
        if (obj && typeof obj.length === 'number') {
            for (let i: number = 0; i < obj.length; i++) {
                if (obj[i].words && typeof obj[i].words.length === 'number') {
                    for (let j: number = 0; j < obj.words.length; j++) {
                        if (
                            typeof obj[i].words[j].word !== 'string' ||
                            typeof obj[i].words[j].definition !== 'string' ||
                            typeof obj[i].words[j].type !== 'string'
                        )
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
    public constructor(params: { path: string; autosave?: boolean }) {
        super({
            ...params,
            fileData: new WordGroupData(),
            createIfNotExists: false,
        });
    }

    public loadWords = (wordGroupIndex: number): void => {
        let data = this.getData();
        if (
            wordGroupIndex >= 0 &&
            wordGroupIndex < data.length &&
            !data[wordGroupIndex].loaded
        ) {
            data[wordGroupIndex].words = JSON.parse(
                fs.readFileSync(
                    `${this.getPath()}/../words/${
                        data[wordGroupIndex].info.filename
                    }`
                )
            );
            data[wordGroupIndex].loaded = true;
            this.setData(data);
        }
    };

    public editGroup = (id: number, info: WordGroupInfo): void => {
        let data = this.getData();
        if (
            !data.every(
                (value: WordGroup, index: number) =>
                    value.info.filename !== info.filename || index === id
            )
        )
            throw new Error(`File with name "${info.filename}" already exists`);

        let oldData = data[id];

        if (oldData.info.filename !== info.filename) {
            fs.unlinkSync(
                `${this.getPath()}/../words/${oldData.info.filename}`
            );
            fs.writeFileSync(
                `${this.getPath()}/../words/${info.filename}`,
                JSON.stringify(oldData.words)
            );
        }

        data[id].info = info;
        this.setData(data);
    };

    public createNewGroup = (info: WordGroupInfo): void => {
        let data = this.getData();
        if (
            !data.every(
                (value: WordGroup) => value.info.filename !== info.filename
            )
        )
            throw new Error(`File with name "${info.filename}" already exists`);
        fs.writeFileSync(
            `${this.getPath()}/../words/${info.filename}`,
            JSON.stringify([])
        );
        data.push({
            info,
            words: [],
            loaded: false,
        });
        this.setData(data);
    };

    public deleteGroup = (index: number): void => {
        let data = this.getData();
        if (index >= 0 && index < data.length) {
            const group = data.splice(index, 1)[0];
            fs.unlinkSync(`${this.getPath()}/../words/${group.info.filename}`);
            this.setData(data);
        }
    };

    public saveWords = (groupIndex: number): void => {
        const data = this.getData();
        if (
            groupIndex >= 0 &&
            groupIndex < data.length &&
            data[groupIndex].loaded
        ) {
            const group = data[groupIndex];
            fs.writeFileSync(
                `${this.getPath()}/../words/${group.info.filename}`,
                JSON.stringify(group.words)
            );
        }
    };

    public createWord = (word: Word, groupIndex: number) => {
        let data = this.getData();
        if (groupIndex >= 0 && groupIndex < data.length) {
            data[groupIndex].words.push(word);
            this.setData(data);
            this.saveWords(groupIndex);
        }
    };

    public editWord = (word: Word, groupIndex: number, wordIndex: number) => {
        let data = this.getData();
        if (groupIndex >= 0 && groupIndex < data.length) {
            data[groupIndex].words[wordIndex] = word;
            this.setData(data);
            this.saveWords(groupIndex);
        }
    };

    public deleteWord = (groupIndex: number, wordIndex: number) => {
        let data = this.getData();
        if (
            groupIndex >= 0 &&
            groupIndex < data.length &&
            wordIndex >= 0 &&
            wordIndex < data[groupIndex].words.length
        ) {
            data[groupIndex].words.splice(wordIndex, 1);
            this.setData(data);
            this.saveWords(groupIndex);
        }
    };
}
