import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

function jwtPayload(userId: Types.ObjectId){
    const payload = {
        iss : null, // issuer
        sub: userId,
        aud: userId, // represent a specific audience that will consume the token
        exp: Math.floor(Date.now() / 1000) + 60 * 60 + 60 * 60, // Expiration time 
        iat: Math.floor(Date.now() / 1000)  // Issued at: current time 
    };

    return payload;
}

// Payload is an object thta we're going to use in order to generate the sign in token and also the refreshToken.
// After a payload we pass secret key, that you can see on docs: https://www.npmjs.com/package/jsonwebtoken

export function signAccessToken(userId: Types.ObjectId){
    const payload = jwtPayload(userId);
    const key = process.env.JWT_TOKEN_KEY as string;

    // We're going to return a new Promise()
    return new Promise((resolve,reject)=>{

        // Here we pass sign() function and we pass "payload". In order to generate token
        // And here we pass the callback
        (jwt as any).sign(payload, key, (error:Error, token:string) => {
            if(error){
                // if we have "error" then reject error
                reject(error)
            }

            // If we receive token, Resolve the promise 
            resolve(token)
        })

    })
}

// call jwtPayload() in order to get payload


// Create two environment variables: JWT_TOKEN_KEY, REFRESH_TOKEN_KEY
// and assign them value using : node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"


export function signRefereshToken(userId: Types.ObjectId){
    const payload = jwtPayload(userId);
    const key = process.env.REFRESH_TOKEN_KEY as string;

    return new Promise((resolve, reject) =>{ 
        jwt.sign(payload,key,(error,token) => {
            if (error){
                reject(error);
            }
            resolve(token)
        })
    })


}



// verify token 
export async function VerifyExpressFunction(req: Request, res: Response, next: NextFunction 
){
    try {

        const token = req.headers?.authorization as string
        const AccessToken = token.split(" ")[1];

        const key = process.env.JWT_TOKEN_KEY as string

        jwt.verify(AccessToken, key, (error, payload) => {
            if (error){
                throw new Error("Unauthorized");

                // the throw new Error("Unauthorized") inside the jwt.verify callback won't be caught by the outer try/catch (since the callback runs asynchronously). Consider changing it to:
                /*
                if (error) {
                    return res.status(401).send({ message: "Unauthorized" });
                }
                next();
                */


            } else {
                next();
            }
        })
        
    } catch (error) {
        res.status(401).send({messsage: "Unauthorized"})
    }
}


export async function generateTokens(userId: Types.ObjectId){
    const [ accessToken, refreshToken ] = await Promise.all([
          signAccessToken(userId),
          signRefereshToken(userId)
    ])

    return {accessToken, refreshToken }
}