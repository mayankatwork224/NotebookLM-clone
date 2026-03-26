import express from "express";
import { Express } from "express";
import cors from "cors";
import { handleExpressError } from "../exceptions/handleExpressError";
import { NextFunction, Response, Request } from "express";

import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { UserRepository } from "../http/controllers/auth/repository/userRepository";
import { Router } from "express";
import { apiV1 } from "src/app/routes/apiV1";


export function expressServer(app: Express, PORT: number) {
  
  // create instance of router
  const router = Router()
  
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );

  
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  apiV1(app,router)

  app.get("/", (req: Request, res: Response) => {
    res.json({ "message": "express server is up and running" });
  });

  const sess = {
    secret : process.env.COOKIE_KEY as string,
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false}
  }

  // To generate COOKIE_KEY. Run this code in your terminal
  // node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  // and set the value in your environment variable

  if(process.env.NODE_ENV == 'production'){
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true // serve secure cookiespassport
  }

  // pass express-session to the express app
  app.use(session(sess))

  // initialize passport and pass passport session
  app.use(passport.initialize())
  app.use(passport.session())

  // It's Just Middleware, Nothing more.



  // --- GOOGLE STARTEGY ---
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
		callbackURL: process.env.CALL_BACK_URL,
        // passReqToCallback: true
      },
      async (accessToken: string, refreshToken:string, profile:any, done:any) => {
          // The function in order to store the user inside the database 
       try {
          // Your user creation logic here
          // const user = profile; // placeholder
          // console.log('create user:', user);

          const userRepo = UserRepository.getInstance();
          const user = await userRepo.createUser(profile,{accessToken, refreshToken});

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
	}
    )
  )

  passport.serializeUser(async (user: any, done) => {
    console.log("user in serialize :", user);
    done(null,user) // store only the User ID
  });
  

  // called on every request that uses the session
  passport.deserializeUser(async (obj: any, done) => {
    try{
      // check if user exist in db
      done(null,obj);
    }catch(err){
      done(err);
    }
  })


  app.get(
    "/auth/google",
    passport.authenticate("google",
      {
        scope: [
          "profile",
          "email",
          "https://www.googleapis.com/auth/drive.readonly",
          "https://www.googleapis.com/auth/drive.file",
        ],
        accessType: "offline",
        prompt: "consent",
      })
  )

    app.get("/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/auth/login",
        successRedirect : process.env.REACT_APP_URL, // frontend route
      })
    )


  app.get("/auth/me", (req: any,res: any) => {
	if (!req.user) return res.status(401).json({error:'Not logged in'})
	res.json(req.user)
  })

  app.use(handleExpressError);

  app.listen(PORT, () => {
    console.log(`Express server is running at http://127.0.0.1:${PORT}`);
  });
}
