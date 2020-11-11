const { Axios } = require('../../axios');
const { axios } = new Axios();
const Jimp = require('jimp');
const { existsSync } = require('fs');
const {  isRequire } = require('../../../util');

async function unsplash(tag = '', size) {
    try {
        const featured = (size) ? size.join('x') : 'featured';
        const tags = (typeof tag !== 'string') ? tag.join(',') : tag;

        const option = {
            url: `/${featured}/?${tags}`,
            method: 'get',
            baseURL: 'https://source.unsplash.com',
            responseType: 'arraybuffer'
        };

        const { data, request: { path } } = await axios(option);

        console.log(data.constructor.name);

        const [filename] = path.replace('/', '').split('?');

        return Promise.resolve({ filename, data });

    } catch (err) {
        return Promise.reject(err);
    }
}

async function flicker(tag = '', groupId = '', quality = 'w') {
    try {

        const tags = (typeof tag !== 'string') ? tag.join(',') : '';

        const option = {
            url: `/services/rest/`,
            method: 'get',
            baseURL: 'https://www.flickr.com/',
            params: {
                method: "flickr.photos.search",
                api_key: process.env.FLICKR_API_KEY || '916ab419002933c078b5093637265e89',
                tags: tags,
                group_id: groupId,
                format: "json",
                nojsoncallback: 1,
                license: "1,2,4,5,7", // Creative Commons License.
                sort: "interestingness-desc",
                content_type: "1", // photos
                media: "photos",
                extras: "original_format",
                per_page: 50,
                page: Math.floor((Math.random() * 50) + 1)
            }
        };

        const { data: { stat, photos, message } } = await axios(option);

        if (stat !== "ok") throw new Error('Flickr return - ' + message);

        const { photo } = photos;

        const random = Math.floor(Math.random() * photo.length);

        const { id, secret, server, originalsecret } = photo[random];

        const { data } = await axios(`https://live.staticflickr.com/${server}/${id}_${secret}${quality !== '' ? '_' + quality : ''}.jpg`, {
            responseType: 'arraybuffer'
        });

        const filename = id + secret + server + originalsecret;

        return Promise.resolve({ filename, data });
    } catch (err) {

        return Promise.reject(err);
    }
}

async function fromFile(path = isRequire('filename')) {
    try {
        if (!existsSync(path)) {
            throw new Error('file doesn\'t exist');
        }

        const img = await Jimp.read(path);
        const buffer = await img.getBufferAsync(img._originalMime);

        return buffer;
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    unsplash,
    flicker,
    fromFile
};
