// free models: https://inference-docs.cerebras.ai/models/overview
import 'dotenv/config';
import { ChatCerebras } from "@langchain/cerebras";
const API_KEY = process.env.CEREBRAS_API_KEY;
const llm = new ChatCerebras({
    model: "llama3.1-8b",
    temperature: 0,
    // maxTokens: undefined,
    // maxRetries: 2,
    // other params...
    apiKey: API_KEY
});
const aiMsg = await llm.invoke([
    {
        role: "system",
        content: "You are a helpful assistant that translates English to Hindi. Translate the user sentence.",
    },
    { role: "user", content: "I love programming." },
]);
console.log(aiMsg["content"]);
// npx tsx src/index3.ts
// create build : npm run build
// This will generate JS file. That will be much similar to the TS file.
//# sourceMappingURL=index3.js.map