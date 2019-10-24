import { promises as fsPromises } from 'fs';

const splitSymbols = '{~}\n';
const pathPublic = './public';
const fileName = 'testFile';

const write = async (counter: number, text: string) => {
    text = `${counter}. ${text}`;
    try {
        await fsPromises.access(pathPublic);
    } catch (err) {
        if(err.code === 'ENOENT') {
            await fsPromises.mkdir(pathPublic);
        }
    } finally {
        await fsPromises.appendFile(`${pathPublic}/${fileName}`, text + splitSymbols);
    }
};

const numberLines = async () => {
    let fileHandle = null;
    let counter: number = 1;

    try {
        fileHandle = await fsPromises.readFile(`${pathPublic}/${fileName}`);
    } catch (err) {
        if(err.code === 'ENOENT') {
            return counter;
        }
    } finally {
        if (fileHandle) {
            counter = fileHandle.toString().split(splitSymbols).length;
        }
    }
    return counter;
};

async function writeTest(text: string) {
    const counter: number = await numberLines();
    await write(counter, text);
}

export default writeTest;



