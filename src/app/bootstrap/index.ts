import { Express } from "express";
import { expressServer } from "./express/expressServer";
import { dbConnection } from "./http/mongoose/dbConnection";

export async function bootStrap(app:Express, PORT:number){

    await dbConnection()
    expressServer(app,PORT)
}