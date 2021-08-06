/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import {azureServicesRouter}  from './lib/azure-speech'
import { userApiRouter } from './lib/user';

import * as cors from 'cors';
var corsOptions = {credentials: true, origin: true}


const app = express();

app.use(cors(corsOptions)); // enable cors everywhere
app.use(express.json());

app.use('/api/get-speech-token', azureServicesRouter);
app.use('/', userApiRouter);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}/`);
});
server.on('error', console.error);
