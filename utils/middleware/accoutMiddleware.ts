import WriteTest from '../../utils/writeTest';

const validationData = async (req, res, next) => {
    const { text, userId }: { text: string, userId: string } = req.body;
    if(text) {
        const w = new WriteTest(userId, 'myFile');
        req.body.pathFile = await w.writeTest(text);
        next();
    } else {
        res.send("not success");
    }
};

export default {
    validationData,
};
