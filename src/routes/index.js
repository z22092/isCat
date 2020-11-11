const router = require('express').Router();
const { upload, fileParser } = require('../middleware');
const { check } = require('../controller');

const debug = require('debug')("server:server");

debug('is load');


router.post('/iscat', upload, fileParser, check);

router.get('/training', async (req, res) => {
    try {
        // await letsTraining();
    } catch (err) {
        debug(err);
        res.json(err.message);
    }
});

module.exports = router;