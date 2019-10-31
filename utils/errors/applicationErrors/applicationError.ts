class ApplicationError extends Error {
    status: number;
    constructor(message, status, name) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = name || this.constructor.name;
        this.message = message || 'Something went wrong. Please try again.';
        this.status = status || 500;
    }
}

export default ApplicationError;
