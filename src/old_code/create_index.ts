import dotenv from 'dotenv';
import { Pinecone, Pinecone as PineconeClient } from "@pinecone-database/pinecone"


dotenv.config({ path: '../.env', debug: false });


const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY as string
});

// You just need to create an environment variable inside the ".env" file. 
// and then this code will use that environment variable and 
await pinecone.createIndex({
    name: process.env.PINECONE_INDEX as string,
    dimension: 1024,  // <-- CRITICAL: Must match Cohere embed-english-v3.0
    metric: 'cosine',
    spec: {
        serverless: {
            cloud: 'aws',
            region: 'us-east-1'
        }
    }
});

console.log("Index Created Successfully.");
