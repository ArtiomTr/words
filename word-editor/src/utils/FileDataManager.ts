const fs = window.require("fs");

export abstract class FileData<T> {

    private data: T;

    public constructor(data?: T) {
        if (data)
            this.data = data;
        else
            this.data = this.createEmpty();
    }

    public getStringifiedData = (): string => {
        return JSON.stringify(this.data);
    }

    public parseData = (jsonString: string): T => {
        const data: any = JSON.parse(jsonString);
        if (this.isValid(data)) {
            return data;
        } else {
            throw new TypeError(`Object "${jsonString}" is not copatible with type`);
        }
    }

    public updateData = (data: Partial<T>): T => {
        this.data = { ...this.data, ...data };
        return this.data;
    }

    public setData = (data: T) => {
        this.data = data;
    }

    public getData = (): T => this.data;

    public abstract isValid(obj: any): obj is T;

    public abstract createEmpty(): T;

}

export default class FileDataManager<T> {

    private path: string;
    private fileData: FileData<T>;

    private autosave: boolean;

    public constructor(params: {
        path: string,
        fileData: FileData<T>,
        autosave?: boolean,
        createIfNotExists?: boolean
    }) {
        this.path = params.path;
        this.autosave = params.autosave ?? true;
        this.fileData = params.fileData;
        this.initialize(params.createIfNotExists ?? false);
    }

    private initialize = (createIfNotExists?: boolean) => {
        try {
            this.load();
        } catch (error) {
            if (createIfNotExists)
                this.save();
            else
                throw error;
        }
    }

    public load = () => {
        this.fileData.setData(this.fileData.parseData(fs.readFileSync(this.path).toString()));
    }

    public save = () => {
        fs.writeFileSync(this.path, this.fileData.getStringifiedData());
    }

    public getData = (): T => {
        return this.fileData.getData();
    }

    public updateData = (data: Partial<T>) => {
        this.fileData.updateData(data);
        if (this.autosave)
            this.save();
    }

    public setData = (data: T) => {
        this.fileData.setData(data);
        if (this.autosave)
            this.save();
    }

    public getPath = () => this.path;

}