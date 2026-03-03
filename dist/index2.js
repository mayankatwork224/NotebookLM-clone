import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import 'dotenv/config';
const API_KEY = process.env.FIREWORKS_API_KEY;
const llm = new ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
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
    console.log(aiMsg);
})();
// npx tsx src/index2.ts
// Fireworks is no longer free
// It changes at least $0.1 
// Cerebra systems / Cerebras inference iffres free tier for their AI inference API. see it is not completely free. It has free tier, daily tokens 10 lakhs(1 M)/per day, 30 RPM(Requests Per Minutes) -- once you hit this limit you can't make more requests until the next day resets. 
// Context length / Max tokens per request varies by model. 
// Inference means; Inference is place where AI model is used to make predictions, generate output(text, image, etc.). You give the input and it will give the output. This is using AI
// Inference means hosted models on Hub. You can send your prompt and get the response -> generated text,imge,etc. back without downloading/training or running model on yourself(on your local machine)
//# sourceMappingURL=index2.js.map