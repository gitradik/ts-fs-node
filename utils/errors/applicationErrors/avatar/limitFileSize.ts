import ApplicationError from '../applicationError';

class LimitFileSize extends ApplicationError {
    constructor(message) {
        super(message || 'FILE TOO LARGE', 413, "LimitFileSize");
    }
}

export default LimitFileSize;
