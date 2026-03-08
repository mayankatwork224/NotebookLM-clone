import 'dotenv/config';
import { ChatCerebras } from "@langchain/cerebras"
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';


import dotenv from 'dotenv';
dotenv.config({ path: '../.env', debug: true });

const API_KEY = process.env.CEREBRAS_API_KEY;

const llm = new ChatCerebras({
    model: "llama3.1-8b",
    temperature: 0,
    apiKey: API_KEY
});



const aiMsg = await llm.invoke([
    
    /*
    {
        role: "system",
        content: "You are a helpful assistant that translates English to Hindi. Translate the user sentence.",
    },
    */


    // ------ Chain Of Thought(COT) ----------
    new SystemMessage(`You are a professional Math Expert, your job is to solve user's questions
        Think step by step based on your reasoning and explain your thoughts`),


    /*
    { 
        role: "user", 
        content: "I love programming." 
    },
    */
    new HumanMessage("x+3=5, what is the value of x")

    // To make the contructor call we need to use the "new" keyword. This is rule/syntax of javascript.
        
]);

console.log(aiMsg["content"]);

console.log("---".repeat(10));

let my_created_aiMessage:AIMessage = new AIMessage("Hello i am a helpful assistant");

console.log(my_created_aiMessage);

