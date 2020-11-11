const { existsSync, mkdirSync, createWriteStream } = require('fs');
const { checkType, isRequire } = require('../../../util');

async function saveFile(buffer, path, filename = isRequire('filename')) {
    try {
        checkType(buffer, 'buffer');
        if (!existsSync(path)) await mkdirSync(path, { recursive: true });
        const fullPath = path + filename;
        if (existsSync(fullPath)) throw new Error('The file already existe');

        const stream = createWriteStream(fullPath);

        await stream.write(buffer);

        return Promise.resolve(true);
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    saveFile
};