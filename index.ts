import express, { Application } from "express";
import cors from "cors";
import env from "dotenv";
env.config();

import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";

const app: Application = express();

app.use(cors());
app.use(express.json());

mainApp(app);
app.listen(parseInt(process.env.PORT as string), () => {
  dbConfig();
});
