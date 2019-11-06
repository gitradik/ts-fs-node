import * as express from "express";
import * as cors from "cors";
import router from "./router";
import errorHandler from './utils/errors/errorHandler';
import 'dotenv/config'
const PORT = process.env.PORT || 5000;

import './db/mongoose';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);
app.use('/static/avatar',
    express.static(__dirname + process.env.AVATAR_BASE_URL, { fallthrough: true }),
    function (req, res) {
        res.sendFile(__dirname + process.env.AVATAR_BASE_URL + '/' + process.env.AVATAR_DEFAULT_NAME_IMG);
    },
);

app.listen(PORT);


