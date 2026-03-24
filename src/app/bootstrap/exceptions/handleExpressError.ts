import { NextFunction, Response, Request} from "express";

export function handleExpressError(err:Error,req:Request,res:Response,next:NextFunction){

    // set a default status code if it's not already set
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    
    // 200 success, 500 Server error
    // IF Everything is OK but still there is some error then say 500 intenal server error

    res.status(statusCode).json({
        error:{
            message: err.message,
            status: statusCode
        }
    })
    
}