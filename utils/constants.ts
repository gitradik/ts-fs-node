export const ROLE_TYPE = {
    ADMIN: 0,
    USER: 1,
    PREMIUM_USER: 2,
};

export const MONGO_ERROR_CODES = [
    {
        code: 11000,
        keyValue: 'email',
        errorType: 'uniqueEmail'
    },
];

export const UPLOAD_AVATAR_ERRORS = [
    {
        code: 'LIMIT_FILE_SIZE',
        keyValue: 'avatar',
        errorType: 'limitFileSize'
    },
    {
        code: 'INAPPROPRIATE_TYPE_FILE',
        keyValue: 'avatar',
        errorType: 'unsupportedMediaType'
    },
];
