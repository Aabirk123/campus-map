import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { isAuthenticatedMiddleware, clientAuthenticationMiddleware, clientLogin } from './userAuthentication';

import * as sqlServerObject from './SQLServerAccess.js';

const SELECT_ALL_DEFAULT_QUERY = 'SELECT LoginName, Pass, StudentID FROM LoginC';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(clientAuthenticationMiddleware);

// app.get('/messages', messagesController.getAll);
// app.post('/messages', messagesController.post);

app.get('/', (req, res) => {
    res.send('go to /users to see user list');
});

app.post('/client-login', clientLogin);

app.get('/users', (req, res) => {
    return sqlServerObject.getUserData(SELECT_ALL_DEFAULT_QUERY, res, req);
});

const { PORT = 4000 } = process.env;
const { IPADRRESS } = ''
app.listen(PORT, 'localhost', () => {
    console.log('RUNNING SERVER');
});