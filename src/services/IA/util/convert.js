const { node: { decodeImage } } = require('@tensorflow/tfjs-node');
const { checkType } = require('../../../util');

async function convert(buffer) {
    try {
        await checkType(buffer, 'buffer');
        const tensor = await decodeImage(buffer);
        return tensor;
    } catch (err) {
        return Promise.reject(err);
    }
}

// async function resize(img) {
//     try {

//     }
// }

module.exports = {
    convert
};

const { flicker, fromFile } = require('./getPhotos');
const { classify, nsfw } = require('../classify');

(async () => {
    try {
        const data = await fromFile('./photos/nsfwTest/happy-sexy-woman-with-cat-resting-bed_1398-5255.jpg');
        const tensor = await convert(data);
        // const nsfwType = await nsfw(tensor);
        // console.log(nsfwType);

        const classType = await classify(tensor);
        console.log(classType);
    } catch (err) {
        console.log('deu ruim');
        console.log(err);
    }
})();