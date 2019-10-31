import ApplicationError from '../applicationError';

class UniqueEmail extends ApplicationError {
    constructor(message) {
        super(message || 'USER WITH SUCH EMAIL ALREADY EXISTS', 403, 'UniqueEmail');
    }
}

export default UniqueEmail;
