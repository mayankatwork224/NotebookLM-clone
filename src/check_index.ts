import { Pinecone as PineconeClient } from "@pinecone-database/pinecone"

import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY as string
});

// Check index stats
const indexStats = await pinecone.describeIndex(process.env.PINECONE_INDEX as string);
console.log("Index configuration:", indexStats);
console.log("Index dimension:", indexStats.dimension);