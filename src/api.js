const express = require('express');
const serverless = require('serverless-http');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());

router.get('/', async (req, res) => {
    const privateKey = process.env.authkey;
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