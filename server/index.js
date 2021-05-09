require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { request } = require('express');
const requestlib = require('request');
// const RasaClient = require("./rasa-api");
const SpeechKeyHelper = require("./speech-key-helper")
const SpeechSynthesis = require("./speech-synthesis");

const cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/get-speech-token', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        res.send(await SpeechKeyHelper());
    } catch (error) {
        res.status(401).send('There was an error authorizing your speech key.');
    }
    
    // const speechKey = process.env.SPEECH_KEY;
    // const speechRegion = process.env.SPEECH_REGION;

    // if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
    //     res.status(400).send('You forgot to add your speech key or region to the .env file.');
    // } else {
    //     const headers = { 
    //         headers: {
    //             'Ocp-Apim-Subscription-Key': speechKey,
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         }
    //     };

    //     try {
    //         const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
    //         res.send({ token: tokenResponse.data, region: speechRegion });
    //     } catch (err) {
    //         res.status(401).send('There was an error authorizing your speech key.');
    //     }
    // }
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

app.post('/api/request-answer', async (req, res, next) => {
    console.log(req.body);
    var rasa_client = new RasaClient('http://localhost:5001');
    try {
        const answer_rasa = await rasa_client.parse(req.body);
    } catch (error) {
        res.sendStatus(500);
        res.send("whoops");
    }
    
    console.log(answer_rasa);
});



app.post('/api/start-speech-synthesis', async (req, res, next) => {
    console.log(req.body.text);
    if (req.body.length === 0) {
        res.sendStatus(300);
        res.send("no data");
    }

    // var speech_client = new SpeechClient('http://localhost:3003');
    try {
        const answer_speech = await SpeechSynthesis(req.body.text);
        res.send("ok");
    } catch (error) {
        res.sendStatus(500);
        res.send("could not synthesise");
    }
});

// app.post('/post-test', (req, res) => {
//     console.log('Got body:', req.body);
//     res.sendStatus(200);
// });

app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);