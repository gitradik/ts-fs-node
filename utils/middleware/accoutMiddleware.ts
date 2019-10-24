import writeTest from '../../utils/writeTest';

const validationData = async (req, res, next) => {
    const { text }: { text: string } = req.body;
    if(text) {
        await writeTest(text);
        req.body.ok = true;
        next();
    } else {
        res.send("not success");
    }
};

export default {
    validationData,
};
