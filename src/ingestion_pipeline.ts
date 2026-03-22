

// ingestion = घूस, (पेट में) उतारना

import { Document } from "@langchain/core/documents"

import {  CohereEmbeddings } from "@langchain/cohere";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

import { PineconeStore } from "@langchain/pinecone"
import { Pinecone, Pinecone as PineconeClient } from "@pinecone-database/pinecone"
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// In order to extract data from the web pages

import dotenv from 'dotenv';


dotenv.config({ path: '../.env', debug: false });


if (!(process.env.COHERE_API_KEY && process.env.PINECONE_API_KEY && process.env.PINECONE_INDEX)) {
    throw new Error("One or more required environment variables are missing in .env: PINECONE_API_KEY, PINECONE_INDEX, or COHERE_API_KEY");
}


// In order to store the data in to vector database we extract the data from the webpage
// We extract the data from the PDF or webpage

export async function webFileEmebedding(url: string) {


    const loader = new CheerioWebBaseLoader(url)
    const docs = await loader.load();

    // console.log("docs :", docs)
    
    
    
    // Once we got the array of documents we pass it to the TextSplitter
    
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 200, // preserve that much no .characters from the previous chunk.
    });
    
    const allSplits = await textSplitter.splitDocuments(docs)
    
    // console.log("allsplits :", allSplits)

    // Debug: verify splits are non-empty
    // console.log(`Number of splits: ${allSplits.length}`);
    // console.log(`First split preview: "${allSplits[0]?.pageContent.substring(0, 100)}"`);





    // embeddings

    const embeddings = new CohereEmbeddings({
        model: "embed-english-v3.0",
        apiKey: process.env.COHERE_API_KEY,
        inputType: "search_document", // “These embeddings are for documents (not user queries)”

        // "search_document" → for storing data
        // "search_query" → for user queries
        // This improves retrieval accuracy.
    })

    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY as string

    })
    // Connect to the pinecone.
    // Pinecone is used to store vectors. 


    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX as string)
    // Tell the vector database i have already generated the Index by UI and; You basically say, "Use this specific table (index) to store and query vectors" 
    // It connects ( or select ) to a specific index inside Pinecone

    // It internally allows: upsert(store vectors), query(search vectors), delete operation


    // Your embedding model (Cohere "embed-english-v3.0") produces vectors of a fixed size. Your pinecone index must have same dimension
    // Otherwise you get erros like: dimention mismatch
    
    // This line connects your app to a specific Pinecone index where all embeddings will be stored and queried. 




    // Store embedding and actual chunks to vector database
    const vectorstore = new PineconeStore(embeddings, {
        pineconeIndex,
        // maxConcurrency: 5, // THis controls maximum no. of concurrrent operations(eg. upsert, query) that can be performed again the Pinecone index. Here 5 means 5 operations can run simultaneously. Which can improve performance for bulk operation.

        namespace : "default",
        textKey: "text"
    })

    /*
    "PineconeStore" is wrapper from langchain around Pinecone.

    It connects your embedding model(Cohere) with your vector database

    so you don't manually generate embeddings and then call Pinecone API. This way you combine both steps. It abstracts everything

    - embeddings : This is your "CohereEmbeddings" object. It's role is to convert text -> vector before storing. Also later it can be used for queries
    - pineconeIndex : This is actual index instance. Tell where vector should be stored. Like selecting a database table.
    - namespace:"default"  : A folder inside your Pinecone index. Namespace is used to separate differnt data-sets without creating new indexes. 
    Eg.  
    Index: my-app
            ├── namespace: "default"
            ├── namespace: "pdf-docs"
            └── namespace: "chat-history"
    - `textKey: "text"` This defines where the original text is stored is, metadata

    {
        "id": "abc123",
        "values": [0.123, 0.456, ...],
        "metadata": {
            "text": "This is the original chunk of text"
        }
    }



    However, The document object you receive after running retriver.ts contains PageContent
    
    Document {
        pageContent: '(2021)), P-tuning (Liu et al. 2021) and Prompt-Tuning (Lester et al. 2021). This section in my “Controllable Neural Text Generation” post has a good coverage of them. The trend from AutoPrompt to Prompt-Tuning is that the setup gets gradually simplified.',
        metadata: {
        'loc.lines.from': 307,
        'loc.lines.to': 307,
        source: 'https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/',
        title: "Prompt Engineering | Lil'Log"
        },
        id: '8128fd7e-ba9a-44c3-99ff-cfa27bbebd6d'
    }


    The important key idea is: 
    There are two different types of representations:
    1. LangChain `Document` object show it as
    ```
    pageContent → main text
    metadata → extra info
    ```

    2. Pinecone storage format (on pinecone UI dashboard you will see something like)
    ```
    {
        "values": [vector],
        "metadata": {
            "text": "...",   ← comes from pageContent
            "source": "...",
            "title": "..."
        }
    }


    `textKey : "text"` It tells vector store: "When storing in Pinecone, take `pageContent` and save it inside metadata under key `"text"`"

    That transformation happens internally,
    when you call : await vectorstore.addDocuments(allSplits);

    Document.pageContent
            ↓
    Embedding (vector)
            ↓
    Store in Pinecone as:

    {
        "values": [...], // vector 
        "metadata": {
            "text": "(your pageContent here)",
            "loc.lines.from": 307,
            "loc.lines.to": 307,
            "source": "...",
            "title": "..."
        }
    }



    That thing also happens when you retrive data from the pinecone. pinecone retrived data --- Transformed to --> Langchain Document object. That is what you see. 
    
    You can confirm this by seeing the pinecone dashboard UI


    ## Why this is needed ?

    Because pincone doesn't contain "PageContent" key separately.
    It only stores: vector(values), metadata(key-value object)

    So langchain must know : "Where do it put the actual text?". That is what `textKey` controls.
    

    ```



    */



    // Above we're just created vectorstore instance from the PineconeStore() class



    // Add documents in smaller batches
    // const batchSize = 50;
    // for (let i = 0; i < allSplits.length; i += batchSize) {
    //     const batch = allSplits.slice(i, i + batchSize);
    //     console.log(`Adding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allSplits.length / batchSize)}`);
    // }
    console.log("Finishing indexing, Please wait..."); 
    await vectorstore.addDocuments(allSplits);

    /*
    1. Take each document chunk
    2. Convert → embedding (via Cohere)
    3. Send → Pinecone
    4. Store with metadata (textKey)

    PineconStore does not store raw text internally. It stores : vector + metadata. so, search happens on vectors. Text is only for display.

    The same "vectorstore" obejct is used when user query the database

    */


    console.log("Indexing Finished. ✅")


}

await webFileEmebedding('https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/')
// This webpage has information about prompt engineering. We're going to store all that dat to our vector database. 