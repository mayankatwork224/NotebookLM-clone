import { ChatFireworks } from "@langchain/community/chat_models/fireworks"
import dotenv from 'dotenv';

dotenv.config({ path: '../.env', debug: true });

// Assume: Your current working directiory is src/ and you're running this file from src/

// If you're running from root folder then it will be => {path:"./env"}


const API_KEY = process.env.FIREWORKS_API_KEY;

if (!API_KEY) {
  throw new Error("FIREWORKS_API_KEY is not set in .env");
}


let llm_model = "accounts/fireworks/models/llama-v3p3-70b-instruct"

// Simple Rule:
// In the Firework test model section of the website the models you can use are freely available
// https://app.fireworks.ai/playground?category=llm&model=accounts%2Ffireworks%2Fmodels%2Fllama-v3p3-70b-instruct


const llm = new ChatFireworks({
    model: llm_model,
    temperature: 0,
    apiKey: API_KEY
    // maxTokens: undefined,
    // timeout: undefined,
    // maxRetries: 2,
    // other params...
});



(async () => { 
    const aiMsg = await llm.invoke([
        [
            "system",
            "You are a helpful assistant that translates English to French. Translate the user sentence.",
        ],
        ["human", "I love programming."],
    ]);
    
    console.log(aiMsg)
})()

// npx tsx src/index2.ts


// Fireworks is no longer free
// It changes at least $0.1 for every model

// Error message: 'Account woceli3554-y8jgcmk2s(tempmail account) is suspended, possibly due to reaching the monthly spending limit or failure to pay past invoices. Please go to https://fireworks.ai/account/billing for more information.',


/*
Cerebra systems / Cerebras inference It has free tier for their AI inference API. see it is not completely free. It has free tier, daily tokens 10 lakhs(1 M)/per day, 30 RPM(Requests Per Minutes) -- once you hit this limit you can't make more requests until the next day resets. 
// Context length / Max tokens per request varies by model. 
*/

/* Inference means : Inference is place where AI model is used to make predictions, generate output(text, image, etc.). You give the input and it will give the output. This is using AI

Inference means hosted models on Hub. You can send your prompt and get the response -> generated text,imge,etc. back without downloading/training or running model on yourself(on your local machine)
*/