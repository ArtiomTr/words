import { readFile, exists, writeFile } from "fs";

const fs = window.require("fs");

interface TempData {

    lastFile: string;

}

export class TempDataManager {

    private path: string;
    private tempData: TempData | null = null;

    public constructor(path: string) {
        this.path = path;
        this.initialize();
    }

    private initialize(): void {
        const data = this.load();
        if (data) {
            let loadedTempData = JSON.parse(data);
            if (!this.isValidTempData(loadedTempData)) {
                loadedTempData = { ...this.createEmptyTempData(), ...loadedTempData };
            }
            this.tempData = loadedTempData;
            this.save();
        } else {
            this.tempData = this.createEmptyTempData();
            this.save();
        }
    }

    public getTempData() {
        return this.tempData;
    }

    public updateTempData(data: Partial<TempData>) {
        if (this.tempData) {
            this.tempData = { ...this.tempData, ...data };
            this.save();
        }
    }

    public setTempData(data: TempData) {
        this.tempData = data;
        this.save();
    }

    public save() {
        fs.writeFileSync(this.path, JSON.stringify(this.tempData));
    }

    private load(): string | false {
        if (fs.existsSync(this.path)) {
            const data: Buffer = fs.readFileSync(this.path);
            return data.toString();
        }

        return false;

    }

    private isValidTempData = (obj: any): obj is TempData => {

        return obj && (obj.lastFile !== undefined && obj.lastFile !== null);

    }

    private createEmptyTempData = (): TempData => {

        return {
            lastFile: ""
        }

    }

}