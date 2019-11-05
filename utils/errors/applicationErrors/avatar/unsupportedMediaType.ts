import ApplicationError from '../applicationError';

class UnsupportedMediaType extends ApplicationError {
    constructor(message) {
        super(message || 'FILE TYPE NOT ALLOWED', 415, "UnsupportedMediaType");
    }
}

export default UnsupportedMediaType;
