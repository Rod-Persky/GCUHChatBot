import * as express from 'express';
import { getSpeechToken } from './speech-key';

var azureServicesRouter = express.Router({mergeParams: true})

azureServicesRouter.route('').get(async (req, res) => {
    try {
        var token = await getSpeechToken();
        res.json(token);
    } catch (error) {
        res.status(500).send('{}');
    }
});

export { azureServicesRouter }
