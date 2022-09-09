const express = require('express');
const serverless = require('serverless-http');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);

// make sure views work from anywhere
// app.set('views', path.join(__dirname, '/views'));

app.use(cors());

router.get('/', async (req, res) => {
    let privateKey = "";
    if (fs.existsSync("AuthKey_KT557LU647.p8")) {
        privateKey = fs.readFileSync("AuthKey_KT557LU647.p8");
    } else {
        privateKey = process.env.authkey.replaceAll(/_/g, "\n")
    }

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

    // res.json(weatherData);
    res.render('weather', { ...weatherData });
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);