import 'dotenv/config';
import { ChatCerebras } from "@langchain/cerebras";
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
const API_KEY = process.env.CEREBRAS_API_KEY;
const llm = new ChatCerebras({
    model: "llama3.1-8b",
    temperature: 0,
    apiKey: API_KEY
});
new AIMessage("ये AI के द्वारा दिया गया response है । ");
const aiMsg = await llm.invoke([
    // {
    //     role: "system",
    //     content: "You are a helpful assistant that translates English to Hindi. Translate the user sentence.",
    // },
    // new SystemMessage("You are a helpful assistant that translates English to Hindi. Translate the user sentence."),
    new SystemMessage(`You are a professional Math Expert, your job is to solve user's questions
        Think step by step based on your reasoning and explain your thoughts`),
    // { role: "user", content: "I love programming." },
    // new HumanMessage("Hello world")
    new HumanMessage("x+3=5, what is the value of x")
]);
console.log(aiMsg["content"]);
//# sourceMappingURL=index4.js.map