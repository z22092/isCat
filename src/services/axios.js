const axios = require("axios");
const { checkType } = require('../util');

class Axios {
    constructor(retry, delay, options = {}) {
        this.retry = retry || 3;
        this.delay = delay || 3;
        this.count = this.retry;
        this.allowList = new Set([
            'ETIMEDOUT',
            'ECONNRESET',
            'EADDRINUSE',
            'ESOCKETTIMEDOUT',
            'ECONNREFUSED',
            'EPIPE',
            'EHOSTUNREACH',
            'EAI_AGAIN',
            "ECONNABORTED"
        ]);
        this._rulesErros = [];
        this._rulesOk = [];
        this.axios = axios.create({ ...options });
        this._setConfig();
    }

    _retry(seconds, originalRequest) {

        const milliseconds = 1000 * seconds;

        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.axios(originalRequest)), milliseconds);
        });
    }

    _isError(error) {

        return (
            error.response &&
            (error.response.status >= 400 || this.allowList.has(error.code))
        );

    }

    _execOkRule(response) {
        const cb = [];
        if (this._rulesOk.length !== 0) {
            for (let i = 0; i < this._rulesOk.length; i++) {
                cb.push(this._rulesOk[i](response));
            }
            return Promise.all(cb);
        } else {
            return response;
        }
    }

    async _execErrorRule(response) {
        try {
            if (this._rulesErros.length !== 0) {
                for (let i = 0; i < this._rulesErros.length; i++) {
                    await this._rulesErros[i](response);
                }
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    addRule(fn, type = 'error') {
        try {
            checkType(fn, 'function', "asyncfunction");
            if (type === 'error') {
                this._rulesErros.unshift(fn);
            } else {
                this._rulesOk.unshift(fn);
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    _setConfig() {
        try {
            checkType(this.retry, 'number');
            checkType(this.delay, 'number');
            this.axios.interceptors.response.use(
                async response => {
                    try {
                        this.count = this.retry;
                        await this._execOkRule(response);
                        return Promise.resolve(response);
                    } catch (err) {
                        return Promise.reject(err);
                    }
                },
                async error => {
                    try {
                        await this._execErrorRule(error);
                        if (this._isError(error) && this.count) {
                            this.count--;
                            const { config } = error;
                            return this._retry(this.delay, config);
                        }
                        this.count = this.retry;
                        return Promise.resolve(error);
                    } catch (err) {
                        return Promise.reject(err);
                    }
                });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = {
    Axios
};
