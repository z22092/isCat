const { checkType } = require('../../util');
const { classify, nsfw } = require('./classify');
const { convert } = require('./util');
const debug = require('debug')('AI:index');

debug('is load');

async function checkIfACat(buffer) {
    try {
        await checkType(buffer, 'buffer');

        debug('valid buffer');

        const tensor = await convert(buffer);

        const nsfwType = await nsfw(tensor);
        debug('nsfw type: ' + nsfwType);
        if (nsfwType !== "Neutral") throw new Error('This is not a Cat!!');

        const classType = await classify(tensor);
        debug('classify type: ' + classType);
        if (classType !== "Cats") throw new Error('This is not a Cat!!');

        debug('is a cat');

        return true;
    } catch (err) {
        debug(err);

        return Promise.reject(err);
    }
}

module.exports = {
    checkIfACat
};