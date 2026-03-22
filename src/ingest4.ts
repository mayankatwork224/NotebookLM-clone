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

    // Process in batches
    const batchSize = 50;
    let totalUpserted = 0;

    for (let i = 0; i < allSplits.length; i += batchSize) {
        const batch = allSplits.slice(i, i + batchSize);
        
        console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allSplits.length / batchSize)}`);
        
        const texts = batch.map(doc => doc.pageContent);
        
        // Generate embeddings
        const vectors = await embeddings.embedDocuments(texts);
        
        // Convert to regular arrays (if needed)
        const pineconeVectors = batch.map((doc, idx) => ({
            id: `doc-${i + idx}-${Date.now()}`,
            values: Array.from(vectors[idx]),
            metadata: { 
                text: doc.pageContent.substring(0, 40000),
                source: url,
                chunkIndex: i + idx
            }
        }));
        
        console.log(`Upserting ${pineconeVectors.length} vectors...`);
        
        try {
            await pineconeIndex.upsert(pineconeVectors);
            console.log(`✅ Upserted ${pineconeVectors.length} vectors`);
            totalUpserted += pineconeVectors.length;
        } catch (error) {
            console.error(`❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error);
            throw error;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Finished! Total vectors upserted: ${totalUpserted}`);
    
    // Verify
    const stats = await pineconeIndex.describeIndexStats();
    console.log(`\nIndex stats:`, stats);
}

await webFileEmbedding('https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/');