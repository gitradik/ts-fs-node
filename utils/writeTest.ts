import { promises as fsPromises } from 'fs';

class WriteTest {
    private userId: string;
    private fileName: string;
    private path: string;
    private splitSymbols: string = '{~}\n';
    private errorCode: string = 'ENOENT';

    constructor(userId: string, fileName: string, path: string = './public') {
        this.userId = userId;
        this.fileName = fileName + '-' + userId;
        this.path = path;
    }

    async numberLines() {
        let fileHandle = null;
        let counter: number = 0;

        try {
            fileHandle = await fsPromises.readFile(`${this.path}/${this.fileName}`);
        } catch (err) {
            if(err.code === this.errorCode) {
                return counter;
            }
        } finally {
            if (fileHandle) {
                counter = fileHandle.toString().split(this.splitSymbols).length - 1;
            }
        }
        return counter;
    }

    async write(counter: number, text: string) {
        text = `${counter}. ${text}`;
        try {
            await fsPromises.access(this.path);
        } catch (err) {
            if(err.code === this.errorCode) {
                await fsPromises.mkdir(this.path);
            }
        } finally {
            await fsPromises.appendFile(`${this.path}/${this.fileName}`, text + this.splitSymbols);
        }
    };

    async writeTest(text: string) {
        if(!this.userId || !this.fileName) {
            throw(new Error('no userId or fileName'));
        }

        const counter: number = await this.numberLines();
        await this.write(counter, text);
        return this.path + '/' + this.fileName;
    }
}

export default WriteTest;



