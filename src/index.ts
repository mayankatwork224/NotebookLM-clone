import express from "express";

import dotenv from "dotenv";
import { bootStrap } from "./app/bootstrap";
dotenv.config({ path: ".env", debug: false });
// You run code from the root folder(i.e. NotebookLM-clone). so that consider as root. and ./.env path relative to it. Then no matter where really the index.ts file is placed.

const app = express();

const PORT = parseInt(process.env.PORT as string);


bootStrap(app,PORT)