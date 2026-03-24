import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";

import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
// These are the packages recommeded by langchain offical documentation for structured output.

import { ChatGroq } from "@langchain/groq";
import { queryVectorDB } from "./retriever"

/*
Node.js executes the entire module once at import time

This includes: all top-level code, all imports, all dotenv.config(), any variable or object defined outside functions
*/

// ES module are executed, not just "read for exports"


/* Example

// fileA.ts
console.log("I RUN!");

export function hello() {
  console.log("Hello");
}


// fileB.ts
import { hello } from "./fileA";

output: I RUN!


------------------------------

1. Keep only definations at top level (best pracice)
export function functionName(){...}

2. Avoid side effect 
Avoid : dotenv.config(..)
and use: import dotenv from "dotenv";

3. If you want python-like code `if __name__ =="__main__"`  
if (import.meta.url === `file://${process.argv[1]}`) {...}

*/



/* Lazy Loading

Laxy loading = delay creating/initializing something until it is actually needed
instead of doing work at import time, you do it only when the function is called


Eager (Not Lazy) -- Run immediately on import
```
import dotenv from "dotenv";
dotenv.config(); // 🚨 runs as soon as file is imported
const embeddings = new CohereEmbeddings(...); // 🚨 also runs on import
```
👉 Even if you never call queryVectorDB, this still executes.



Lazy Loading -- runs only when needed
```
export async function queryVectorDB(query: string) {
    const dotenv = await import("dotenv");
    dotenv.config(); // ✅ runs ONLY when function is called

    const embeddings = new CohereEmbeddings(...); // ✅ created only now

    ...
}
```
👉 Nothing runs during import. Everything waits until:
`await queryVectorDB("hello");`


Why this type of system is created. What if everything runs import time:
- ❌ Slower startup
- ❌ Unnecessary API usage
- ❌ Harder to control lifecycle

*/


import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const API_KEY = process.env.GROQ_API_KEY;


if (!API_KEY) {
  throw new Error("GROQ_API_KEY is not set in .env");
}


// https://console.groq.com/playground
const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY
})


// Different chatmodels you can use with langchain: https://docs.langchain.com/oss/javascript/integrations/chat#example-openrouter
// Their you can see the Groq support the feature withStructuredOutput(). Again thing depends on model not the provider. But what langchain tells is that most of the model supports withStructuredOutput()

const query = "What is Prompt engineering"

const result = await queryVectorDB(query)
// console.log(result)



const prompt = PromptTemplate.fromTemplate(`
  You are assistant for question-answering tasks. Use the following pieces of retrived context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum sentences and keep the answer concise. 
  Question : {question}
  Context : {context}
  Answer : 
`)


// We pass the "context" and "query" to prompt. The entire prompt we pass as query
const promptVal = await prompt.invoke({
  question: query,    // User Question
  context: result[0]?.pageContent // Passing first document's PageContent as Context
});


const llmResult = await llm.invoke([{
    role: "user",
    content: promptVal.value
}])

console.log('content',llmResult["content"]);






