
class ServerError extends Error {
    constructor() {
        super('Internal Server Error');
        this.name = 'ServerError';
        this.status = 500;
    }
}

class InvalidParamError extends Error {
    constructor(paramName) {
        super(`Only images formats 'gif', 'jpeg', 'png', 'bmp' are allowed  Invalid format: ${paramName}`);
        this.name = 'InvalidParamError';
        this.status = 422;
    }
}

class MissingParamError extends Error {
    constructor(paramName) {
        super(`Missing param: ${paramName}`);
        this.name = 'MissingParamError';
        this.status = 400;
    }
}

module.exports = {
    ServerError,
    InvalidParamError,
    MissingParamError
};