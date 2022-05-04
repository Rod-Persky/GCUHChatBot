/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import {azureServicesRouter}  from './lib/azure-speech'
import { userApiRouter } from './lib/user';
//const bodyParser = require('body-parser');


import * as cors from 'cors';
var corsOptions = {credentials: true, origin: true}


const app = express();

app.use(cors(corsOptions)); // enable cors everywhere
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:true}));

app.use('/api/speech', azureServicesRouter);
app.use('/', userApiRouter);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}/`);
});
server.on('error', console.error);
