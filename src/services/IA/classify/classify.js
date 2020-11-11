
const tf = require('@tensorflow/tfjs-node');
const { isRequire, checkType } = require('../../../util');
const { mobilenet: { path }, labels, size, imageChannels, loadModelTimeout } = require('../config');
const debug = require('debug')('AI:classify');

debug('is load');

let load = false;

let model;

(async () => {
    model = await tf.loadLayersModel(path);
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

async function classify(tensor) {
    try {
        debug('classify init');

        await checkType(tensor, 'tensor');

        await checkLoad();

        tensor = tf.image.resizeNearestNeighbor(tensor, [size, size], true);
        tensor = tensor.reshape([1, ...tensor.shape]);

        const predictions = await model.predict(tensor);

        const data = await predictions.data();
        debug('Prediction data:');
        debug(data);

        const id = data.indexOf(Math.max(...data));

        predictions.dispose();

        const classification = labels[id];

        return Promise.resolve(classification);
    } catch (err) {
        debug(err);
        return Promise.reject(err);
    }
}

module.exports = {
    classify
};