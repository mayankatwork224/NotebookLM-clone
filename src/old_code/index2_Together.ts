import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env', debug: true });


const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;
if (!TOGETHER_AI_API_KEY) {
  throw new Error("TOGETHER_AI_API_KEY is not set in .env");
}


const llm = new ChatTogetherAI({
    model: "Qwen/Qwen2.5-7B-Instruct",
    temperature : 0
});


const aiMsg = await llm.invoke([
    {
        role: "system",
        content: "You are a helpful assistant",
    },
    { role: "user", content: "What is Ai ?" },
])

console.log(aiMsg.content)


// src> npx tsx index6.ts

// Not work Requires payment. All models are now paid
/// Even thought the wesite says pricing n/a. When you use it give error "Credit limit exceeded"