require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { request } = require('express');
const pino = require('express-pino-logger')();
const requestlib = require('request');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/get-speech-token', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;

    if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
        res.status(400).send('You forgot to add your speech key or region to the .env file.');
    } else {
        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            res.send({ token: tokenResponse.data, region: speechRegion });
        } catch (err) {
            res.status(401).send('There was an error authorizing your speech key.');
        }
    }
});

app.get('/api/get-chat-token', async (req, res, next) => {

    const options = {
        method: "POST",
        uri: 'https://directline.botframework.com/v3/directline/tokens/generate',
        headers: {
            'Authorization': 'Bearer Na6r7i1UcnU.o2J7GnDONj821CVHLJeTj9ISJbycjJyRveBX-igVvxk',
        }
    }

    const chatKey = process.env.CHAT_KEY;
    const headers = { 
        headers: {
            'Accept': '*/*',
            'Authorization': 'Bearer Na6r7i1UcnU.o2J7GnDONj821CVHLJeTj9ISJbycjJyRveBX-igVvxk',
        }
    };

    try {
        // const tokenResponse = await axios.post('https://directline.botframework.com/v3/directline/tokens/generate', null, headers);
        requestlib.post(options, (error, response, body) => {
            if (!error && response.statusCode < 300) {
                res.json(JSON.parse(body));
            } else {
                res.status(500).send('There was an error authorizing your chat key.');
            }
        })
    } catch (err) {
        console.log(err)
        res.status(401).send('There was an error authorizing your chat key.');
    }
    
});

app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);