import ApplicationError from '../applicationError';

class ConflictAccountData extends ApplicationError {
    constructor(message) {
        super(message || 'CONFLICT OF ACCOUNT DATA', 409, 'ConflictAccountData');
    }
}

export default ConflictAccountData;
