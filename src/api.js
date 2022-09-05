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
    const privateKey = fs.readFileSync("AuthKey_KT557LU647.p8") || process.env.authkey.replaceAll(/_/g, "\n");
    const token = jwt.sign(
        {
          sub: 'com.gilmour.weather',
        },
        privateKey,
        {
          jwtid: 'QA25HR6SCP.com.gilmour.weather',
          issuer: 'QA25HR6SCP',
          expiresIn: '1h',
          keyid: 'KT557LU647',
          algorithm: 'ES256',
          header: {
            id: 'QA25HR6SCP.com.gilmour.weather',
          }
        }
      );

    const url = 'https://weatherkit.apple.com/api/v1/weather/en-us/42.41658/-76.48944?dataSets=currentWeather';
      
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    
    const { data: weatherData } = await axios.get(url, config);

    res.json(weatherData);
    // res.json({
    //     'fruit': 'banana',
    //     'privateKey': privateKey,
    //     'vegetable': 'jicama'
    // })
});

router.get('/mango', (req, res) => {
    res.json({
        'fruit': 'mango'
    })
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);