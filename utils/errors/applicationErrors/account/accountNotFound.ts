import ApplicationError from '../applicationError';

class AccountNotFound extends ApplicationError {
    constructor(message) {
        super(message || 'ACCOUNT NOT FOUND', 404, 'AccountNotFound');
    }
}

export default AccountNotFound;
