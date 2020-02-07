import FileDataManager, { FileData } from "./FileDataManager";

export interface TempData {

    lastFile: string;

}

class TempFileData extends FileData<TempData> {

    public isValid(obj: any): obj is TempData {
        return obj && obj.lastFile !== undefined && obj.lastFile !== null;
    }

    public createEmpty(): TempData {
        return {
            lastFile: ""
        }
    }

}

export class TempDataManager extends FileDataManager<TempData> {

    public constructor(params: { path: string, autosave?: boolean }) {
        super({
            ...params,
            fileData: new TempFileData(),
            createIfNotExists: true
        });
    }

}