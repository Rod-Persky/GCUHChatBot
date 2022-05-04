import * as express from 'express';
import { getSpeechToken, synthSpeech } from './speech-key';

var azureServicesRouter = express.Router({mergeParams: true})

azureServicesRouter.route('/token').get(async (req, res) => {
    try {
        var token = await getSpeechToken();
        res.json(token);
    } catch (error) {
        res.status(500).send('{}');
    }
});

azureServicesRouter.route('/say').post(async (req, res) => {
    try {
        console.log("getting token");
        var token = await getSpeechToken();
        console.log(req.body);
        synthSpeech(token, req.body.text);
        res.json({status: "ok"});
    } catch (error) {
        res.status(500).send('{}');
    }
});



export { azureServicesRouter }
