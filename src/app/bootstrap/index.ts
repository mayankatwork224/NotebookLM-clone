import { Express } from "express";
import { expressServer } from "./express/expressServer";

export function bootStrap(app:Express, PORT:number){
    expressServer(app,PORT)
}