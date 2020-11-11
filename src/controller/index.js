const debug = require('debug')('controller');
const { checkIfACat } = require('../services');
debug('is load');

async function check(req, res) {
    try {
        const { buffer } = req;
        const predictions = await checkIfACat(buffer);
        res.status(200).json({ message: predictions });
    } catch (err) {
        debug(err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    check
};