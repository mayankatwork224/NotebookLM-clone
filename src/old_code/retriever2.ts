import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Cohere, CohereEmbeddings, CohereRerank } from "@langchain/cohere";
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
        // maxConcurrency: 5 
        //maxiumum means There can be less than 5 but not more than 5 
    });

    // const result = await vectorstore.similaritySearch(query, 10);   // return DocumentInterface<Record<string, any>>[] object
    // This gives direct retrivered documents

    //This will give same output as above 
    const retriever = vectorstore.asRetriever();  


    const result = await retriever.invoke(query)
    // return DocumentInterface<Record<string, any>>[] object

    // return result




    // We're going to use Cohere Model provider in order to rank documents
    const cohereRank = new CohereRerank({
        model: "rerank-english-v3.0",       // reranking model
        apiKey: process.env.COHERE_API_KEY,
    });

    const reRankedDocuments = await cohereRank.rerank(result, query, {
        topN : 5
    })


    // ======== Dry Run | Debugging | Understand how it works ========
    // console.log("result :",result)
    // console.log("-".repeat(70));

    // console.log("(START) Logging from retriver2.ts ....");
    // console.log(reRankedDocuments)
    // console.log("(END) Logging from retriver2.ts ✅.");

    
    // console.log("-".repeat(70));
    
    // console.log(result[reRankedDocuments[0].index])
    
    // To test it's woking fine or not run the retriver2.ts


    // But till now it doesn't return anything so the "allRetrivedDocs" array  inside generator2.ts is going to be empty

    if (result.length>0){
        return [result[reRankedDocuments[0].index]] 
        
        // we're taking like result[0], result[1]
        // reRankedDocuments JS Object is sorted as per "relevanceScore" in descending order. means highest one come first. 
        // So, we're taking the first element from the reRankedDocuments JS Object's index value( it can be 0,1,..)
        // and passed as subscript to result array. 

        // means taking the top matched document( with highest relevanceScore) and return it. 

        // and it will be added to the "allRetrivedDocs" in "generator2.ts"

    }else {
        return []
    }

    // Now implement reciprocal rank function RRPF.ts


}


// const result = await queryVectorDB("What is few shot");
// const result = await queryVectorDB("What is prompt engineering ?");
// console.log(result)
 



// To see the "pageContent" only
/*
result.forEach((doc)=>{
    console.log(doc.pageContent , `\n ${"-".repeat(50)}`)
})
*/



