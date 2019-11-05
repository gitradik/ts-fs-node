import * as multer from 'multer';
import 'dotenv/config';

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/avatars',
    filename: function (req, file, cb) {
        // null as first argument means no error
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Init upload
const uploadAvatarImg = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }
}).single(process.env.AVATAR_FIELD);

function sanitizeFile(file, cb): void {
    // Define the allowed extension
    const fileExts = ['png', 'jpg', 'jpeg', 'gif'];
    // Check allowed extensions
    const isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    } else {
        // pass error msg to callback, which can be display in frontend
        cb({ code: 'INAPPROPRIATE_TYPE_FILE' });
    }
}

export default uploadAvatarImg;


