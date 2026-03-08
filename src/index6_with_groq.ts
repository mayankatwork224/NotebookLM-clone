// npm install @langchain/groq --legacy-peer-deps
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from '@langchain/core/prompts';

import {z} from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import dotenv from 'dotenv';
dotenv.config({ path: '../.env'});

const API_KEY = process.env.CEREBRAS_API_KEY;

if (!API_KEY) {
  throw new Error("CEREBRAS_API_KEY is not set in .env");
}


const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile", 
  temperature: 0.4, 
});



const prompt_json = PromptTemplate.fromTemplate(`
        You are a professional Math Expert, your job is to solve user's questions. 
        Here is the user question
        {input}

        strictly follow the instructions given to you for the output schema
`)


const prompt_result2 = await prompt_json.invoke({input:"x+4=10, so what will be the x"})






const result = await llm.invoke(prompt_result2,{
    response_format: {
      type: "json_object",
      schema: zodToJsonSchema(
        z.object({
          "value_of_x": z.number(),
        }) as any
       
      )
    }
}) as Record<string,any>



const parsed = JSON.parse(result?.content);

console.log(parsed);