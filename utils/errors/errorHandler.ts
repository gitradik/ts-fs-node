import ERROR_TYPES from './errorTypes';
import errors from './applicationErrors';

export default function (err, req, res, next) {
    const error = new errors[ERROR_TYPES[err.type]]();
    res.status(error.status).send(error);
}
