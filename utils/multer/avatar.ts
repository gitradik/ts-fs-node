import * as multer from 'multer';
import 'dotenv/config';

const storage = multer.diskStorage({
    destination: './public/avatars',
    filename: function (req, file, cb): void {
        let orgName = JSON.stringify(file.originalname);
        let newName = '';
        for (let i = 0; i < orgName.length; i++) {
            newName += orgName.charAt(i) === '"' || orgName.charAt(i) === ' ' ? '-' : orgName.charAt(i);
        }
        cb(null, Date.now() + '-' + newName);
    }
});

const uploadAvatarImg = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb): void {
        sanitizeFile(file, cb);
    }
}).single(process.env.AVATAR_FIELD);

function sanitizeFile(file, cb): void {

    const fileExts = ['png', 'jpg', 'jpeg', 'gif'];

    let newStr = '';

    for (let i = file.originalname.length - 1; i > 0; i--) {
        if (file.originalname.charAt(i) === '.') break;
        newStr += file.originalname.charAt(i);
    }

    newStr = [...newStr].reverse().join('');

    const isAllowedExt = fileExts.includes(newStr.toLowerCase());

    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {
        cb({ code: 'INAPPROPRIATE_TYPE_FILE' });
    }
}

export default uploadAvatarImg;


