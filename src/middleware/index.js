
const multer = require('multer');
const Jimp = require('jimp');
const fs = require('fs');
const debug = require('debug')('middleware');

const { InvalidParamError, MissingParamError } = require('../error');

debug('is load');

function upload() {
    try {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "upload/");
            },
            fileFilter: (req, file, cb) => {
                try {
                    const [type, mime] = file.mimeType.split('/');
                    switch (mime) {
                        case ('gif' | 'jpeg' | 'png' | 'bmp'):
                            cb(null, true);
                            break;
                        default:
                            throw new InvalidParamError(mime);
                    }
                } catch (err) {
                    cb(err);
                }
            },
            filename: (req, file, cb) => {
                cb(null, (+Date.now()) + "-" + file.originalname);
            }
        });

        const upload = multer({ storage });

        const type = upload.single('file');

        return type;
    } catch (err) {
        return Promise.reject(err);
    }
}

async function fileParser(req, res, next) {
    try {
        if (!req.file) throw new MissingParamError('image multipart/form-data');
        else {

            debug(req.file);

            const { path, mimetype } = req.file;
            const img = await Jimp.read(path);
            const buffer = await img.getBufferAsync(mimetype);

            req.file.buffer = buffer;

            debug('buffer is create');

            fs.unlinkSync(path);

            next();
        }
    } catch (err) {
        debug(err);
        res.status(err.status).send(err.message);
    }
}

module.exports = {
    upload: upload(),
    fileParser
};
