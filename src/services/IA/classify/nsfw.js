const nsfwjs = require('nsfwjs');
const { checkType } = require('../../../util');
const { nsfw: { path, size }, loadModelTimeout } = require('../config');
const debug = require('debug')('AI:nsfw');

debug('is load');

let load = false;

let model;

(async () => {
    model = await nsfwjs.load(path, { size });
    load = true;
    debug('model load: ' + load);
})();

async function checkLoad() {
    try {
        if (!load) {
            debug('checkLoad');

            let counter = + new Date();
            const second = 1000;
            const maxTime = loadModelTimeout * second;
            const chronometer = counter + maxTime;

            await new Promise((resolve, reject) => {
                const timer = setInterval(() => {
                    counter = counter + second;
                    if (load || counter >= chronometer) {
                        clearInterval(timer);
                        (!load) ?
                            reject(new Error('Classify time out to load model')) :
                            resolve(true);
                    }
                }, second);
            });
        }
        return Promise.resolve();
    } catch (err) {
        debug(err);
        return Promise.reject(err);
    }
}


async function nsfw(tensor) {
    try {
        debug('nsfw init');

        await checkType(tensor, 'tensor');

        await checkLoad();

        const [{ className }] = await model.classify(tensor);

        debug('Prediction data:');
        debug(className);

        return Promise.resolve(className);
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    nsfw
};