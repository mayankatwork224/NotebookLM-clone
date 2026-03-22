import { CohereEmbeddings } from "@langchain/cohere";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const embeddings = new CohereEmbeddings({
    model: "embed-english-v3.0",
    apiKey: process.env.COHERE_API_KEY,
    inputType: "search_document",
})

// Test that embeddings work
console.log("Testing embedding generation...");
const testEmbedding = await embeddings.embedQuery("test query");
console.log(`Embedding dimension: ${testEmbedding.length}`);
console.log(`Embedding sample: [${testEmbedding.slice(0, 5).join(', ')}...]`);

// Test embedding the first split
// const firstSplitEmbedding = await embeddings.embedDocuments([allSplits[0].pageContent]);
// console.log(`First split embedded successfully. Dimension: ${firstSplitEmbedding[0].length}`);