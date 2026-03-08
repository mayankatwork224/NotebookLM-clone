// npm install @langchain/groq --legacy-peer-deps
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from '@langchain/core/prompts';

import {z} from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import dotenv from 'dotenv';
dotenv.config({ path: '../.env'});

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  throw new Error("GROQ_API_KEY is not set in .env");
}


const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile", 
  temperature: 0.4, 
});



const prompt_json = PromptTemplate.fromTemplate(`
You are a professional Math Expert.

Solve the user's question.

User Question:
{input}

Return the response strictly as a JSON object.
  [
    value_of_x :  
  ]
`);


const prompt_result2 = await prompt_json.invoke({input:"x+4=10, so what will be the x"})






const result = await llm.invoke(prompt_result2,{
    response_format: {
      type: "json_object",
      
    }
}) as Record<string,any>

/* This is called type assertion ( in other words type casting)
- as : Treat that value as this type

In typescript Record is utility type, The Record utility type in TypeScript is used to create an object type with specific key and value types.

```js
type UserAges = {
  [key: string]: number;
};
```

Record<string,any> means:an object where keys are strings and values can be anything.
*/

const parsed = JSON.parse(result?.content);

console.log(parsed);

// The output parser schema we removed here, because groq model doesn't support that.
// That just old functionality. and It is way better to parse output using output parser, which is native way with langchain. Not this type of zod like third party integration. Those integrations sometimes not handled well by langchain. and Give Non-explainable, Large errors.