import express from "express";
import {Express} from "express";
import cors from "cors";
import { handleExpressError } from "../exceptions/handleExpressError";
import { NextFunction, Response, Request} from "express";


export function expressServer(app:Express, PORT:number){
    
    app.use(cors({
        origin: "*",
        credentials : true
    }))


    app.use(express.json())
    app.use(express.urlencoded({extended:true}))

    app.use(handleExpressError)

    app.get("/", (req: Request,res:Response) => {
        res.json({message: "express server is up and running"})
    })

    app.listen(PORT, () => {
        console.log(`Express server is running at http://127.0.0.1:8000`)
    })
}