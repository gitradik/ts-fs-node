import ApplicationError from '../applicationError';

class Unregistered extends ApplicationError {
    constructor(message) {
        super(message || 'USER NOT LOGGED IN', 401, "Unregistered");
    }
}

export default Unregistered;
