#!/usr/bin/env tsx

// npm install @langchain/groq --legacy-peer-deps
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from '@langchain/core/prompts';

import {z} from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import dotenv from 'dotenv';
import { ConditionalPromptSelector } from "@langchain/core/example_selectors";
dotenv.config({ path: '../.env',debug: false, quiet: true});

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  throw new Error("GROQ_API_KEY is not set in .env");
}


const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile", 
  temperature: 0.4, 
});



const prompt = PromptTemplate.fromTemplate(`
You are a professional Math Expert.

Solve the user's question.

User Question:
{input}

Return the response strictly as a JSON object.
  {{
    value_of_x :  
    }}
`);

// With one single curly bracket pair, Langchain thinks it is Input. To omit that and to print literal `{ `, `}` you need to double them


// const prompt_result = await prompt.invoke({input:"x+4=10, so what will be the x"})


const chain =  prompt.pipe(llm)



const result = await chain.invoke(
    {
        input:"x+4=10, so what will be the x"
    }
)


// Pretty-json
console.log(JSON.stringify(JSON.parse(result["content"] as string), null, 4)) ;

// null : no replacer function
// 4 : tab size