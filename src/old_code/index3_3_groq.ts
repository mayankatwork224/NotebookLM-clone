


import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

import dotenv from 'dotenv';
dotenv.config({ path: '../.env'});

const API_KEY = process.env.GROQ_API_KEY;


if (!API_KEY) {
  throw new Error("GROQ_API_KEY is not set in .env");
}

// The API key is automatically loaded from the GROQ_API_KEY environment variable.
// Alternatively, you can pass it explicitly via the constructor:
// const model = new ChatGroq({ apiKey: "...", model: "..." });
const model = new ChatGroq({
  model: "llama-3.3-70b-versatile", // Specify the desired model (e.g., "llama-3.3-70b-versatile", "gemma2-9b-it")
});




async function runExample() {
  const message = new HumanMessage("Explain the difference between a CPU and a GPU.");

  console.log("Invoking Groq model...");
  const response = await model.invoke([message]);

  console.log("Response content:");
  console.log(response.content);
}

runExample();

