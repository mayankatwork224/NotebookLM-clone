import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai"; // Used for Cohere, OpenRouter, Nvidia
import { ChatCohere } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import dotenv from 'dotenv';


// This code runs only when file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  dotenv.config({ path: '../../.env', debug: true });
}


// ✅ Should be (from chatmodel folder to root).  Suppose you run briefing_doc.ts from "src/" folder. 
// src folder consider as root and find the "../.env" path, and then Run
dotenv.config({ path: '../.env', debug: true });

// if the model is not available or rate limits exceed, time out or any other reason then automatically swith another model instead of code crash

const primaryLLM = new ChatGroq({
  model: "llama-3.1-8b-instant", // small and fast
  //   model: "llama-3.3-70b-versatile",
  //   model: "openai/gpt-oss-120b",
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY,
});
// If rate limit exceed means for all model(entire Provider) rate limit exceed now can not call any other from that provider

const cerebrasLLM = new ChatOpenAI({
  modelName: "llama3.1-8b",
  temperature: 0.7,
  configuration: {
    baseURL: "https://api.cerebras.ai/v1",
    apiKey: process.env.CEREBRAS_API_KEY,
  },
});

const cohereLLM = new ChatCohere({
  model: "command-r-plus",
  temperature: 0.7,
  apiKey: process.env.COHERE_API_KEY,
});

const googleLLM = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

const openRouterLLM = new ChatOpenAI({
  model: "google/gemma-3-12b-it:free",
  temperature: 0.7,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  apiKey: process.env.OPENROUTER_API_KEY,
});

const nvidiaLLM = new ChatOpenAI({
  model: "llama-3.1-nemotron-safety-guard-8b-v3",
  temperature: 0.7,
  apiKey: process.env.NVIDIA_API_KEY,
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  },
});

export const llm = primaryLLM.withFallbacks({
  fallbacks: [cerebrasLLM, cohereLLM, googleLLM, openRouterLLM, nvidiaLLM],
});

// Advanced: Cost-Optimized Fallback Strategy---> Free/cheap models first, expensive ones as last resort

/* Diagram

Request
   │
   ▼
┌─────────────────┐
│ Groq (Primary)  │ ──✓──▶ Success
└─────────────────┘
   │ ✗ (Rate limit)
   ▼
┌─────────────────┐
│ Cohere          │ ──✓──▶ Success
└─────────────────┘
   │ ✗ (Error)
   ▼
┌─────────────────┐
│ Google Gemini   │ ──✓──▶ Success
└─────────────────┘
   │ ✗ (Timeout)
   ▼
┌─────────────────┐
│ OpenRouter      │ ──✓──▶ Success
└─────────────────┘
   │ ✗ (Down)
   ▼
┌─────────────────┐
│ NVIDIA NIM      │ ──✓──▶ Success
└─────────────────┘
   │ ✗ (All failed)
   ▼
Throw Error
*/

// Usage
// const response = await llm.invoke("Explain quantum computing in simple terms");
// console.log(response.content);