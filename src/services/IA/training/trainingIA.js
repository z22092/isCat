const axios = require('axios');
const uuid = require('uuid').v1;
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { convert, predictions } = require('./services/classify/classify');
const { saveModelPath, epochsValue, mobilenet } = require('./config.json');
const debug = require('debug')('traingin:main');
debug('is load');

let model = null;

async function createTransferModel(model) {
    try {
        // Create the truncated base model (remove the "top" layers, classification + bottleneck layers)
        const bottleneck = model.getLayer("dropout"); // This is the final layer before the conv_pred pre-trained classification layer
        const baseModel = tf.model({
            inputs: model.inputs,
            outputs: bottleneck.output
        });

        // Freeze the convolutional base
        for (const layer of baseModel.layers) {
            layer.trainable = false;
        }

        // Add a classification head
        const newHead = tf.sequential();


        newHead.add(tf.layers.flatten({
            inputShape: baseModel.outputs[0].shape.slice(1)
        }));


        newHead.add(tf.layers.dense({ units: 100, activation: 'relu' }));
        newHead.add(tf.layers.dense({ units: 100, activation: 'relu' }));
        newHead.add(tf.layers.dense({ units: 10, activation: 'relu' }));
        newHead.add(tf.layers.dense({
            units: 2,
            kernelInitializer: 'varianceScaling',
            useBias: false,
            activation: 'softmax'
        }));


        // Build the new model
        const newOutput = newHead.apply(baseModel.outputs[0]);


        const newModel = tf.model({ inputs: baseModel.inputs, outputs: newOutput });

        return Promise.resolve(newModel);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function trainModel(model) {
    try {
        // Setup training data
        const imageSamples = [];
        const targetSamples = [];
        for (let i = 0; i < 200; i++) {
            let result = await pickCatImage();
            imageSamples.push(result);
            targetSamples.push(tf.tensor1d([1, 0]));
            debug('cat Image ' + i);
        }
        for (let i = 0; i < 200; i++) {
            let result = await pickRandomImage();
            imageSamples.push(result);
            targetSamples.push(tf.tensor1d([0, 1]));
            debug('random Image ' + i);

        }
        const xs = tf.stack(imageSamples);
        const ys = tf.stack(targetSamples);
        tf.dispose([imageSamples, targetSamples]);

        await model.compile({ loss: "meanSquaredError", optimizer: "adam", metrics: ["acc"] });

        // Train the model on new image samples
        await model.fit(xs, ys, {
            epochs: epochsValue,
            // shuffle: true,
            callbacks: {
                onEpochBegin: async (epoch, logs) => {
                    debug(`Epoch ${epoch + 1} of ${epoch} ...`);
                },
                onEpochEnd: async (epoch, logs) => {
                    debug(`  train-set loss: ${logs.loss.toFixed(4)}`);
                    debug(`  train-set accuracy: ${logs.acc.toFixed(4)}`);
                }
            }
        });
        return model;
    } catch (err) {
        return Promise.reject(err);
    }
}


async function training() {
    try {
        // Load the model
        model = await tf.loadLayersModel(mobilenet);
        model = await createTransferModel(model);
        model = await trainModel(model);
        await model.save(saveModelPath);
        return model;
        // setInterval(async () => {
        //     const cat = await pickCatImage();
        //     const beOrNotToBe = await predictions(cat);
        //     debug(beOrNotToBe);
        // }, 2000);

    } catch (err) {
        debug(err);
        return Promise.reject(err);
    }
}

module.exports = {
    letsTraining
};

