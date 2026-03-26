import express from 'express';
import {Express, NextFunction, Request, Response} from 'express';
import { google } from 'googleapis';


// get google drive files
export async function getUserDriveFiles(req: Request, res: Response, next: NextFunction){
    try{

        // retrive data of the authenticated user
        const user = req.user as any;  // That variable will contain that JSON data 


        if(!user?.authData?.googleAccessToken){
            return res.status(401).json({ message: "No Google! access token found"})
        }

        // initialize oauth2
        const oauth2Client = new google.auth.OAuth2({
            client_secret:process.env.GOOGLE_CLIENT_SECRET as string,
            client_id:process.env.GOOGLE_CLIENT_ID as string
        });

        // credential passing to the oauth2 client
        oauth2Client.setCredentials({
            access_token: user?.authData?.googleAccessToken,
            refresh_token: user?.authData?.googleRefreshToken
        })

        const drive = google.drive({version : "v3", auth: oauth2Client});

        // return array of 10 files
        const response = await drive.files.list({
            pageSize: 10,
            fields: "files(id, name, mimeType, webViewLink)"
        })

        return res.json(response.data.files)

    }catch (error){
        console.error(error);
        res.status(500).json({message: "Failed to fetch Drive files"})
    }
}