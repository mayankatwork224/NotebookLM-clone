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
    // Load and split documents
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 200,
    });
    
    const allSplits = await textSplitter.splitDocuments(docs);
    console.log(`Number of splits: ${allSplits.length}`);
    console.log(`First split preview: "${allSplits[0]?.pageContent.substring(0, 100)}"`);

    // Initialize embeddings
    const embeddings = new CohereEmbeddings({
        model: "embed-english-v3.0",
        apiKey: process.env.COHERE_API_KEY,
        inputType: "search_document",
    });

    // Initialize Pinecone
    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY as string
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX as string);

    // Process in batches (Pinecone recommends batches of 100 or less)
    const batchSize = 50;
    let totalUpserted = 0;

    for (let i = 0; i < allSplits.length; i += batchSize) {
        const batch = allSplits.slice(i, i + batchSize);
        
        console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allSplits.length / batchSize)}`);
        console.log(`Documents in batch: ${batch.length}`);
        
        // Extract text content
        const texts = batch.map(doc => doc.pageContent);
        
        // Generate embeddings
        console.log(`Generating embeddings...`);
        const vectors = await embeddings.embedDocuments(texts);
        console.log(`Generated ${vectors.length} embeddings of dimension ${vectors[0].length}`);
        
        // Prepare vectors for Pinecone with proper format
        const pineconeVectors = batch.map((doc, idx) => {
            const globalIdx = i + idx;
            return {
                id: `doc-${globalIdx}-${Date.now()}`,
                values: vectors[idx],
                metadata: {
                    text: doc.pageContent,
                    source: url,
                    loc: JSON.stringify(doc.metadata.loc || {}),
                    chunkIndex: globalIdx,
                }
            };
        });
        
        console.log(`Prepared ${pineconeVectors.length} vectors`);
        console.log(`Sample vector:`, {
            id: pineconeVectors[0].id,
            valuesLength: pineconeVectors[0].values.length,
            metadataKeys: Object.keys(pineconeVectors[0].metadata),
            textPreview: pineconeVectors[0].metadata.text.substring(0, 50)
        });
        
        // Upsert to Pinecone
        try {
            await pineconeIndex.upsert(pineconeVectors);
            console.log(`✅ Upserted ${pineconeVectors.length} vectors`);
            totalUpserted += pineconeVectors.length;
        } catch (error) {
            console.error(`❌ Error upserting batch ${Math.floor(i / batchSize) + 1}:`, error);
            throw error;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Finished! Total vectors upserted: ${totalUpserted}`);
    
    // Verify indexing
    const stats = await pineconeIndex.describeIndexStats();
    console.log(`\nIndex stats:`, stats);
}

await webFileEmbedding('https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/');