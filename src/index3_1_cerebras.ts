// free models: https://inference-docs.cerebras.ai/models/overview

import { ChatCerebras } from "@langchain/cerebras"

import dotenv from 'dotenv';
dotenv.config({ path: '../.env', debug: true });


const API_KEY = process.env.CEREBRAS_API_KEY;
if (!API_KEY) {
  throw new Error("CEREBRAS_API_KEY is not set in .env");
}

const llm = new ChatCerebras({
    model: "llama3.1-8b",
    temperature: 0,
    // maxTokens: undefined,
    // maxRetries: 2,
    // other params...
    apiKey: API_KEY
});

const aiMsg = await llm.invoke([
    {
        role: "system",
        content: "You are a helpful assistant",
    },
    { 
        role: "user", 
        content: "What is AI ?" 
    },
])

console.log(aiMsg["content"])


// npx tsx src/index3.ts

// create build : npm run build
// This will generate JS file. That will be much similar to the TS file.