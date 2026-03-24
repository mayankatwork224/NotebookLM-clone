import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Cohere, CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
// This is called an ES Module named import with aliasing(renaming). This is called named import(as opposed to default import) + alias. 




import dotenv from 'dotenv';
if (import.meta.url === `file://${process.argv[1]}`) {

    dotenv.config({ path: '../.env', debug: false });

    // Run only if the file is runned directly. 
}

export async function queryVectorDB(query:string){

    const embeddings = new CohereEmbeddings({
        model: "embed-english-v3.0",
        apiKey: process.env.COHERE_API_KEY,
        inputType: "search_document",
    });

    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY as string
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX as string);

    const vectorstore = new PineconeStore(embeddings, {
        pineconeIndex,
        namespace : "default",
        textKey: "text",
        maxConcurrency: 5 
        //maxiumum means There can be less than 5 but not more than 5 
    });

    // const result = await vectorstore.similaritySearch(query, 10);   // return DocumentInterface<Record<string, any>>[] object
    // This gives direct retrived documents


    // This will give same output as above 
    const retriever = vectorstore.asRetriever();  // This gives "VectorStoreRetriever<PineconeStore>". That's what LLM chain expects. you can not give the result object directly.

    // Even then LLM chain expects retriver. Here we invoke the  retriver and get result and that we returned. That returned result we use as context passed to the LLM 

    const result = await retriever.invoke(query)
    
    // return DocumentInterface<Record<string, any>>[] object

    // we pass the retriver to the LLM
    // LLM will retrive similar docs from the vector database and pass it to the LLM as context. 

    return result

}


// const result = await queryVectorDB("What is prompt engineering ?");
 
/*
const result = await queryVectorDB("What is few shot");
console.log(result)


// To see the "pageContent" only
result.forEach((doc)=>{
    console.log(doc.pageContent , "\n-----------------\n")
})

*/




// ================ Create Own Document ================
// "Document" class is used to create our custom documents

/* const docArray = [
    new Document({
        pageContent : "something",
        metadata : {
            title : "",
            source : "",
            page : ""
        }
    }),
    new Document({
        pageContent : "More data",
        metadata : {
            title : "",
            source : "",
            page : ""
        }
    }),
    
]

console.log(docArray) */

/* 

You see array of document. 


The "result" array it returns array of Document() objects  
When you hover on the `const result` you will get : const result: DocumentInterface<Record<string, any>>[]

That is object of DocumentInterface ( Dynamic method dispatch concept )


Also inside the "retriver.ts" we see, "CheerioWebBaseLoader" class it creates a 'loader' object. When hover on the loader object you will see it is instance of "Document<Record<string,any>>" each Document is key-value pair, key=string and value=any(any datatype or object).


We take those array of documents (docs) and pass to another class 

First we create a instace of "RecursiveCharacterTextSplitter" class. then we use that instance's method splitDocuments() and pass "docs" to it. It will split the "docs" into chunks.


Then we create an Embedding model using the cohere LLM provider.  CohereEmbeddings()



*/


