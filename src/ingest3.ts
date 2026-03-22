import { CohereEmbeddings } from "@langchain/cohere";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

if (!(process.env.COHERE_API_KEY && process.env.PINECONE_API_KEY && process.env.PINECONE_INDEX)) {
    throw new Error("Missing environment variables");
}

export async function webFileEmbedding(url: string) {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 200,
    });
    
    const allSplits = await textSplitter.splitDocuments(docs);
    console.log(`Number of splits: ${allSplits.length}`);

    const embeddings = new CohereEmbeddings({
        model: "embed-english-v3.0",
        apiKey: process.env.COHERE_API_KEY,
        inputType: "search_document",
    });

    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY as string
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX as string);

    // TEST: Try upserting just ONE vector manually
    console.log("\n=== TEST: Single vector upsert ===");
    
    const testText = "This is a test document for embedding.";
    const testEmbedding = await embeddings.embedQuery(testText);
    
    console.log(`Test embedding dimension: ${testEmbedding.length}`);
    console.log(`All values are numbers: ${testEmbedding.every(v => typeof v === 'number')}`);
    
    const testVector = {
        id: 'test-vector-1',
        values: testEmbedding,
        metadata: { text: testText }
    };
    
    try {
        console.log("\nAttempting single vector upsert...");
        await pineconeIndex.upsert([testVector]);
        console.log(`✅ Test upsert successful! Upserted 1 vector`);
        
        // If test works, try with actual batch
        console.log("\n=== Proceeding with actual data ===");
        
        const batch = allSplits.slice(0, 5);
        const texts = batch.map(doc => doc.pageContent);
        
        console.log(`\nProcessing ${batch.length} documents...`);
        const vectors = await embeddings.embedDocuments(texts);
        
        console.log(`Generated ${vectors.length} embeddings`);
        
        const pineconeVectors = batch.map((doc, idx) => ({
            id: `doc-${idx}`,
            values: vectors[idx],
            metadata: { 
                text: doc.pageContent.substring(0, 1000),
                source: url 
            }
        }));
        
        console.log(`\nAttempting batch upsert of ${pineconeVectors.length} vectors...`);
        await pineconeIndex.upsert(pineconeVectors);
        console.log(`✅ Batch upsert successful! Upserted ${pineconeVectors.length} vectors`);
        
    } catch (error) {
        console.error("❌ Error:", error);
        throw error;
    }

    // Verify
    const stats = await pineconeIndex.describeIndexStats();
    console.log(`\nIndex stats:`, stats);
}

await webFileEmbedding('https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/');