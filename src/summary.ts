// Remove this import entirely:
// import { collapseDocs, splitListOfDocs } from "langchain/chains/combine_docs";

// Replace with your own implementations:

function splitListOfDocs(
    docs: Document[],
    lengthFunc: (docs: Document[]) => Promise<number>, // expects lenghtFunction is async function, because returns Promise()
    // Promise() : A Promise in JavaScript is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It acts as a placeholder for a value that is not yet availabl

    tokenMax: number
): Document[][] {
    const result: Document[][] = [];
    let currentBatch: Document[] = [];
    let currentLength = 0;

    for (const doc of docs) {
        const docLength = approximateTokens(doc.pageContent);
        if (currentLength + docLength > tokenMax && currentBatch.length > 0) {
            result.push(currentBatch);
            currentBatch = [];
            currentLength = 0;
        }
        currentBatch.push(doc);
        currentLength += docLength;
    }
    if (currentBatch.length > 0) {
        result.push(currentBatch);
    }
    return result;
}

async function collapseDocs(
    docs: Document[],
    combineFunc: (input: Document[]) => Promise<string>
): Promise<Document> {
    const result = await combineFunc(docs);
    return new Document({ pageContent: result });
}

import { Document } from "@langchain/core/documents";
import { StateGraph, Annotation, Send } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatGroq } from "@langchain/groq";

import dotenv from 'dotenv';
dotenv.config({
    path: '../.env',
    debug: false
});



// Ask LM-Arena to review the code. So it give the sugeesstion 
// Code Quality Improvements: Move helper functions before usage

// 1. Imports
// 2. Config (dotenv, loader, etc.)
// 3. Helper functions (approximateTokens, lengthFunction, splitListOfDocs, collapseDocs)
// 4. Graph definitions
// 5. Execution





// You can create a config object
// const CONFIG = {
    // chunkSize: 1000,
    // chunkOverlap: 200,
    // tokenMax: 1000,
    // modelName: "llama-3.3-70b-versatile",
    // temperature: 0.7,
    // recursionLimit: 10
// } as const;

// This way you need to change(Tweak) settings at one place and without find and replace in entire code 
// You can use the config object as, 
// model : CONFIG.modelName


const loader = new CheerioWebBaseLoader('https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/');

const docs = await loader.load()

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});
const splitDocs = await textSplitter.splitDocuments(docs)


const llm = new ChatGroq({
    //   model: "llama-3.1-8b-instant",
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    apiKey: process.env.GROQ_API_KEY
})


let tokenMax = 1000;

function approximateTokens(text: string): number {

    // Roughly:  1 token ≈ 4 characters (English text)

    return Math.ceil(text.length / 4);

}


async function lengthFunction(documents: Document[]) {

    // We use this function in order to calculate no. of tokens in entire Document array 
    // Here, Document[] array. Entire document convert to chunks those chunks as Doucment object. and combined them as we get Document[]


    /*

    document(..) ==== tokens ==> 12,
    document(..) ==== tokens ==> 22,
    ...

    */


    const tokenCounts = documents.map(doc => approximateTokens(doc.pageContent));
    // return a new array with transformed elements

    // []

    return tokenCounts.reduce((sum, count) => sum + count, 0)
    // reducer() is just from map(), filter(), reduce()
    // till now this what we're using. you've not noticed yet. 

    // Higher order function: A function that satisfies at least of these criteria.
    // - Take one or more function as argument often called callbacks
    // - Returns a new functioin as its result. 

    // reduce() function doesn't return a array. like map() and filter() returns. reduce() returns a single value 

    // reduce() --> combine all values at once
    // sum = returning total
    // cont = current value

    // [100, 250, 80]

    // → 100 + 250 = 350  
    // → 350 + 80 = 430 <------- Final results


    // the 2nd argumnt we passed "0" that is initial value of "sum". 0 where calculation starts.






}


// The functions in JS are first-clas citizens. meaning they can be treated like any other value such as numbers, strings (primitive datataype) 
// functions can be used and manipulated in same flexible ways you would use a string, a number, or an array allow you to powerful programming patterns. 
/* 
const greet = function() {
  console.log("Hello, world!");
};
*/
// function can be passed as an argument to another function

// function can be return by some another function.
/*
function createMultiplier(factor) {
  return function(num) { // an inner function is returned
    return num * factor;
  };
}
*/








// Graph code


const OverallState = Annotation.Root({
    contents: Annotation<string[]>,

    summaries: Annotation<string[]>({
        reducer: (state, update) => state.concat(update)
    }),
    // Here we use reducer function. This is because we want to combine all summaries we generate from individual nodes back into one list. -- this is essentially the reduce part

    collapsedSummaries: Annotation<Document[]>,

    finalSummary: Annotation<string>

});


// This will be the state of the node that will "map" all document in order to generate summaries
interface SummaryState {
    content: string;
}




// Here we generate a summar for given document
const generateSummary = async (
    state: SummaryState
): Promise<{ summaries: string[] }> => {
    const mapPrompt = ChatPromptTemplate.fromMessages([
        ["user", "Write a concise summary of the following: \n\n{content}"]
    ]);

    const prompt = await mapPrompt.invoke({ content: state.content });
    const response = await llm.invoke(prompt)

    return { summaries: [String(response.content)] }
}



const mapSummaries = (state: typeof OverallState.State) => {


    return state.contents.map(
        (content) => new Send("generateSummary", { content })
    )
    // We will return list of Send() objects. Each Send() object consists of the name of the node in the graph as well as the state(data) to send to that node
}


const collectSummaries = async (state: typeof OverallState.State) => {
    return {
        collapsedSummaries: state.summaries.map(
            (summary) => new Document({ pageContent: summary })
        )
    }
}


// ✅ Fixed
async function _reduce(input: Document[]): Promise<string> {
    const reducePrompt = ChatPromptTemplate.fromMessages([
        ["user",
            `The following is a set of summaries:
            {docs}
            Take these and distill it into a final, consolidated summary of the main themes.`
        ]
    ]);
    const docString = input.map(doc => doc.pageContent).join("\n\n");
    const prompt = await reducePrompt.invoke({ docs: docString });
    const response = await llm.invoke(prompt);
    return String(response.content);
}


const collapseSummaries = async (state: typeof OverallState.State) => {
    const docLists = splitListOfDocs(
        state.collapsedSummaries,
        lengthFunction,
        tokenMax
    )
    // This the function we import from the langchain



    const results = [];
    for (const docList of docLists) {
        results.push(await collapseDocs(docList, _reduce))
    }
    return { collapsedSummaries: results };
}



async function shouldCollapse(state: typeof OverallState.State) {
    let numTokens = await lengthFunction(state.collapsedSummaries); // collapasesSummaries infers to array of Document(). You can hover and check

    // Potential infinite loop risk:  If a single document in collapsedSummaries is > tokenMax, the graph will loop forever. Add a safeguard:

    // ✅ Add safety check - if only 1 doc left and still too long, give up
    if (state.collapsedSummaries.length === 1 && numTokens > tokenMax) {
        console.warn("⚠️ Single document exceeds tokenMax, proceeding anyway");
        return "generateFinalSummary";
    }



    if (numTokens > tokenMax) {
        return "collapseSummaries"
    } else {
        return "generateFinalSummary"
    }
}
// This represent a condition for the conditional edge,  That determines if we should collapse the summaries or not


const generateFinalSummary = async (state: typeof OverallState.State) => {
    const response = await _reduce(state.collapsedSummaries);
    return { finalSummary: response }
}


// Construct Graph

const graph = new StateGraph(OverallState)
    .addNode("generateSummary", generateSummary)
    .addNode("collectSummaries", collectSummaries)
    .addNode("collapseSummaries", collapseSummaries)
    .addNode("generateFinalSummary", generateFinalSummary)

    .addConditionalEdges("__start__", mapSummaries, ["generateSummary"])
    // __start__ is starting node
    // mapSummaries is the function(router/decision-maker). It decice which node to go next based on current state
    // ["generateSummary"] This is list the possible target node. The function can only send execution to "generateSummary" node

    // function returns something like : "return new Send("generateSummary", { ... })" and graph moves to "generateSummary" 

    .addEdge("generateSummary", "collectSummaries")
    .addConditionalEdges("collectSummaries", shouldCollapse, [
        "collapseSummaries",
        "generateFinalSummary"
    ])
    .addConditionalEdges("collapseSummaries", shouldCollapse, [
        "collapseSummaries",
        "generateFinalSummary"
    ])
    .addEdge("generateFinalSummary", "__end__");


const app = graph.compile()


let finalSummary = null;

for await (const step of await app.stream(
    { contents: splitDocs.map((doc) => doc.pageContent) },
    { recursionLimit: 10 }
)) {
    console.log(Object.keys(step))
    // if(step.hasOwnProperty("generateFinalSummary")){
    //     finalSummary = step.generateFinalSummary
    // }
    if ("generateFinalSummary" in step) {
        finalSummary = step.generateFinalSummary.finalSummary;
    }
}


console.log("final summary:", finalSummary)


/*


First we 
- generateSummary
then
- collectSummaries
- collapseSummary (untill length < max_tokens)
- generateFinalSummary



These summary(ies) include reasoning of the Ai. Based on the provided summaries. The main theme can be consolidate into the following core areas
*/