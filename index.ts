import * as express from "express";
import * as cors from "cors";
import router from "./router";
const app = express();

//import 'dotenv/config';
//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", process.env.TOKEN_SALT);

const PORT = 3333;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT);
