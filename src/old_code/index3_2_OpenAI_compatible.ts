// free models: https://inference-docs.cerebras.ai/models/overview

import { ChatOpenAI } from "@langchain/openai"
import dotenv from 'dotenv';
dotenv.config({ path: '../.env', debug: true });

const API_KEY = process.env.CEREBRAS_API_KEY;
if (!API_KEY) {
  throw new Error("CEREBRAS_API_KEY is not set in .env");
}

const llm = new ChatOpenAI({
    model: "llama3.1-8b",
    temperature: 0,
    apiKey: API_KEY,
    configuration: {
        baseURL: "https://api.cerebras.ai/v1"
    }
});

const aiMsg = await llm.invoke([
    {
        role: "system",
        content: "You are a helpful assistant",
    },
    { role: "user", content: "say Hello from OpenAI creator." },
])

console.log(aiMsg.content)