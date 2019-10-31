import * as express from "express";
import * as cors from "cors";
import router from "./router";
import errorHandler from './utils/errors/errorHandler';
const PORT = 3333;

import './db/mongoose';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(PORT);
