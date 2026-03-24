import { ChatCerebras } from "@langchain/cerebras"
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';

import {z} from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";


import dotenv from 'dotenv';
dotenv.config({ path: '../.env'});

const API_KEY = process.env.CEREBRAS_API_KEY;

if (!API_KEY) {
  throw new Error("CEREBRAS_API_KEY is not set in .env");
}

// ===================================================================================


// LLM / ChatModel
const llm = new ChatCerebras({
    model: "gpt-oss-120b",
    
    temperature: 0,
    apiKey: API_KEY
});


const prompt = PromptTemplate.fromTemplate(`
        You are a professional Math Expert, your job is to solve user's questions. Think step by step based on your reasoning and explain your thoughts

        Here is the user question
        {input}

        Instuctions:
        - You need to do the thinking internally but do not show me any thiking related steps just give a straight forward answer in one line
`)

// AI need to think step by step in the scenario like :
// When i was 10 years old my sister was 5 years old. So what age of my sister when i am is 20 years old.

// At first it looks like you need to just say, half of 10 = 5. 20 -> 10, But the actual answer should be 15. 
// This is the scenario where Chain Of Thoughts(COT) is useful.


// const prompt_result = await prompt.invoke({input:"x+5=6, wgat is the value of x"})
const prompt_result = await prompt.invoke({input:"When i was 10 years old my sister was 5 years old. So what age of my sister when i am is 20 years old."})
// method 1

// const result = await llm.invoke([new HumanMessage(prompt_result.value)])
// console.log(result["content"]);






// -------------- Output Parser -----------------------

// method 2
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

/*

## What is zod ?
Zod is schema validation library for Javascript / Typescript


- It defines the shape of the data
- It cheks if data mathces that shape

// Create a zod object dfine schema
const schema = z.object({
  name: z.string(),
  age: z.number()
})


------

## Code explaination:

The 2nd parameter in llm.invoke() --> Settings / instructions 

response_format tells Ai how response should look(A Json object). 

instead of : The value of x is 10.

Your expected output:
{
  "value_of_x": "10"
}




AI model can not understand zod directly. so we convert Zod schema -> JSON schema. 
That conversation is done by librray called "zod-to-json-schema"

z.object() : This creates a Zod object schema., AI response must be an JS object. 

Inside that JS object, There must be filed "value_of_x" ad it's type must be "string"

}) as any
=> Since we are using Typescript also. Sometimes typescript complain about mismatch. So this way we tell "don't check the type here"


----

## Concept

Zod schema → JSON schema → given to AI

when you pass the 2nd argument as zod schema

Your code send something
```
Please respond in JSON format like this schema:

{
  "value_of_x": "string"
}
```
Instructiion is generated from Zod scheama coverted by zod-to-json-schema libary.

internally it becomes 
```
{
  "type": "object",
  "properties": {
    "value_of_x": {
      "type": "string"
    }
  },
  "required": ["value_of_x"]
}
```


so Ai knows what structure to return


So yes:

- ✔ AI gives JSON to you.
- But the structure was first given to AI.
*/


const parsed = JSON.parse(result?.content);

console.log(parsed);



