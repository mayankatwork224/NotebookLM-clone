import mongoose from "mongoose";

// since we've imported the "dotenv" in src/index.ts. Here no need to import it. We can just directly use it, 

export async function dbConnection(){
    // mongoose.connect("mongodb://127.0.0.1:27017/notebooklm")
    mongoose.connect(process.env.MONGODB_CONNECTION_URL as string)
    .then(()=>{console.log("Connected to MongoDB")})
    .catch(()=>{console.log("MongoDB Connection Error!")})
}