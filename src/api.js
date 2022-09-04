const express = require('express');
const serverless = require('serverless-http');
const router = express.Router();

const app = express();

router.get('/', (req, res) => {
    res.json({
        'fruit': 'banana'
    })
});

router.get('/mango', (req, res) => {
    res.json({
        'fruit': 'mango'
    })
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);