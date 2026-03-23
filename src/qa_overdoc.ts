// we're going to implement a Graph in orde rto give node 


import { StateGraph, START, END, Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { extractMessage, generateResponseFormatter, gradeDocResponseSchema, questionResponseFormater } from "./utils/index.js";

import { Document } from "@langchain/core/documents";

// ---------- (START)Take Imports from the "generator2.ts" ----------
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatGroq } from "@langchain/groq";
import { queryVectorDB } from "./retriever2.ts"
import dotenv from 'dotenv';
import { reciprocalRankFusion } from "./RRF.js";
import { DocumentInterface } from "@langchain/core/documents";
import cliMarkdown from 'cli-markdown';
import { generate_question_prompt, grade_doc_prompt, transform_query_prompt, response_generator_prompt } from "./prompt/prompts.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { TavilySearch } from "@langchain/tavily";
// import { formatDocumentsAsString } from "langchain/util/document";
// This doesn't work that's why create

// ✅ Add own cutom helper function
function formatDocumentsAsString(docs: DocumentInterface<Record<string, any>>[]): string {
    return docs
        .map((doc, index) => `Document ${index + 1}:\n${doc.pageContent}`)
        .join("\n\n");
}


dotenv.config({ path: '../.env' });

const API_KEY = process.env.GROQ_API_KEY;


if (!API_KEY) {
    throw new Error("GROQ_API_KEY is not set in .env");
}


// https://console.groq.com/playground
const llm = new ChatGroq({
    // model: "llama-3.1-8b-instant",   // It doesn't support structured output
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    apiKey: process.env.GROQ_API_KEY
})

// ---------- (END)Take Imports from the "generator2.ts" ----------



const StateAnotation = Annotation.Root({


    // To define "messages" a pre-built-in state Annotation
    ...MessagesAnnotation.spec,

    // This will become :   messages: BaseMessage[] , It can store HumanMessage(), AIMessage(), SystemMessage(), etc.

    // spread operator(...)   This means:
    // 👉 “Take all fields defined inside MessagesAnnotation.spec and include them here.” 





    // Define
    // nextNode, retrivedDoc, filteredDoc, trasformQuery

    nextNode: Annotation<string>({
        default: () => "",
        reducer: (previousVal, nextVal) => previousVal ?? nextVal ?? ""

        // null-collasion operator
        // ??  : It will return Right hand side value only if Left hand side value is "null" or "undefined"
        // || (OR operator) : It return right hand side operand if left hand side operand has any falsy value("", 0, null, undefined)

        // if the previousVal is not defiend(undeifined) we retrun nextVal
        // if nextVal is not defined we return empty.

    }),
    newQuery: Annotation<string>({
        default: () => "",
        reducer: (previousVal, nextVal) => previousVal ?? nextVal ?? ""
    }),

    retrivedDoc: Annotation<Document[]>({ // Change type to list of string
        default: () => [],         // default value equals to empty list
        reducer: (previousValue, nextValue) => previousValue.concat(nextValue),

        // Example
        // ["cherry"] , ["ben"] --> output: ["cherry", "ben"]

    }),

    filteredDoc: Annotation<Document[]>({
        default: () => [],
        reducer: (previousValue, nextValue) => previousValue.concat(nextValue),
    }),
    generateQuestions: Annotation<Document[]>({
        default: () => [],
        reducer: (previousValue, nextValue) => previousValue.concat(nextValue),
    })


    // So, Here we have two strings and two array.

})



// Create Nodes
// Node is nothing byt a simple JS functions. Each Node done it's task and return updated State 


// retriver : [retriver, question-gen, fused]
// Inside retriver node. We're going to have  [retriver, question-gen, fused]


const RetriverNode = async (state: typeof StateAnotation.State) => {

    // our "retriver" function we make async, because the invoke() method will return promise. and in order to get the result or promise and wait, we need to use "await"
    // and the await can only be used inside the "async", that's why we make the function async

    // user query
    const lastMessage = extractMessage(state, 'human')
    const query = lastMessage?.content as string;




    // ------ Code Copied From generator2.ts ------------
    const generateQuestionPrompt = await generate_question_prompt.invoke({
        question: query,
    });

    const responseSchema = z.object({
        questions: z.array(z.string())
    });

    const llmResult = await llm.invoke([{
        role: "user",
        content: generateQuestionPrompt.value
    }], questionResponseFormater as any);



    const parsedResponse = JSON.parse(llmResult?.content as string);

    const questions = parsedResponse?.questions

    const allRetrivedDocs: DocumentInterface<Record<string, any>>[] = []

    for (const question of questions) {
        const result: any = await queryVectorDB(question);
        allRetrivedDocs.push(result);
    }

    const fusedResult = reciprocalRankFusion(allRetrivedDocs);
    const fusedDoc = fusedResult.map(item => item.doc).filter(Boolean) as DocumentInterface<Record<string, any>>[];


    return {
        retrivedDoc: fusedDoc,
        generateQuestions: questions
    }
    // Since the retirvedDoc is array of Documents, we need to pass the value inside as array this way [],  like return { retrivedDoc: [fusedDoc] }. In our case the "fusedDoc" already contains array of Document object. so we don't need to pass it as inside array. It's like already stored array inside a variable and we're passing that variable 
}




const gradeDocNode = async (state: typeof StateAnotation.State) => {
    const lastMessage = extractMessage(state, 'human');

    const allRetrivedDoc = state.retrivedDoc;

    const chain = grade_doc_prompt.pipe(llm);
    const allFilteredDoc: Document[] = []

    for (const doc of allRetrivedDoc) {

        const chainResult = await chain.invoke({
            question: lastMessage?.content,
            context: doc?.pageContent
        }, gradeDocResponseSchema as any)


        // ✅ FIX: Clean the response before parsing
        let content = chainResult?.content as string;

        // const parsedResult = JSON.parse(chainResult?.content as string) as 'yes'| 'no'

        // Remove markdown code blocks if present
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const parsedResult = JSON.parse(content);

        // ✅ FIX: Check the correct property name from your schema
        const score = parsedResult?.binaryScore as 'yes' | 'no'

        if (score === "yes") {
            allFilteredDoc.push(new Document({ pageContent: doc?.pageContent }))
        }
    }


    return { filteredDoc: allFilteredDoc }
}

const transformQuery = async (state: typeof StateAnotation.State) => {

    console.log("---- TRANSFORM QUERY ----");

    const chain = transform_query_prompt.pipe(llm).pipe(new StringOutputParser())

    // Instead of getting AIMessage() and all other objects, you will get string. 
    // The string can contain LLM reasoning <think>..</think> 


    const lastMessage = extractMessage(state, 'human');
    const betterQuestion = await chain.invoke({ question: lastMessage?.content })

    // return { transformQuery: betterQuestion } // name of function and name state property should not be same
    return { newQuery: betterQuestion }
}

const webSearch = async (state: typeof StateAnotation.State) => {


    const lastMessage = extractMessage(state, 'human');
    const tool = new TavilySearch({
        apiKey: process.env.TAVILY_API_KEY as string,

    })
    const docs = await tool.invoke({ query: lastMessage?.content }) // instead of passing entirehuman message pass the content only to avoid error


    const webResult = docs?.results.map((doc) => (
        new Document({
            pageContent: doc?.pageContent,
            metadata: {
                title: doc?.title,
                url: doc?.url,
            },
        })
    ));

    return { retrivedDoc: webResult }
}




const generate = async (state: typeof StateAnotation.State) => {


    const lastMessage = extractMessage(state, 'human');

    const docToString = formatDocumentsAsString(state.retrivedDoc);

    const generatorResPrompt = await response_generator_prompt.invoke({
        original_question: lastMessage?.content,
        questions: state.generateQuestions.join(","),
        retrieved_docs: docToString
    })



    const aiResponse = await llm.invoke([{
        role: "user",
        content: generatorResPrompt.value
    }], generateResponseFormatter)



    // const result = JSON.parse(aiResponse?.content as string)  as {resoning:string,answer:string}


    // ✅ FIX: Clean the response
    let content = aiResponse?.content as string;
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const result = JSON.parse(content) as { reasoning: string, answer: string }

    console.log("--".repeat(30), "AI REASONING", "--".repeat(30));
    console.log(result?.reasoning)
    console.log("----".repeat(50));

    return { messages: [new AIMessage(result?.answer)] }
}


const router = (state: typeof StateAnotation.State) => {

    // In order to decide if we can generate the response to the user or we can transform the user query in order to make web search


    const filteredDocs = state.filteredDoc;

    if (filteredDocs.length === 0) {
        return 'transformQuery';
    }
    return 'generate';

}


// Every node take state as input and return a partialState(some updated part of state) that updates actual state. 
// Edges define the flow, the connection between two nodes, the execution.



// Pass these Nodes to the graph and Create a Graph
const builder = new StateGraph(StateAnotation)
    .addNode("RetriverNode", RetriverNode)
    .addNode("gradeDocNode", gradeDocNode)
    .addNode("generate", generate)
    .addNode("transformQuery", transformQuery)
    .addNode("webSearch", webSearch);


builder.addEdge(START, "RetriverNode")
    .addEdge("RetriverNode", "gradeDocNode")
    .addConditionalEdges("gradeDocNode", router)
    .addEdge("transformQuery", "webSearch")
    .addEdge("webSearch", END)
    .addEdge("webSearch", "generate")    // ✅ FIX: webSearch should go to generate
    .addEdge("generate", END);          // ✅ FIX: generate goes to END



// compile graph
const app = builder.compile();
// Graph Flow:   RetriverNode → gradeDocNode → generate → END


// simple call

try {
    // Invoke the graph
    const result = await app.invoke({
        messages: [
            new HumanMessage("Types of prompt engineering")
        ]
    });
 
    // console.log("Result :", result); // raw result

    // ✅ Better output formatting
    console.log("\n" + "=".repeat(80));
    console.log("📝 QUESTION:", result.messages[0].content);
    console.log("=".repeat(80));
    console.log("\n💡 ANSWER:\n");
    console.log(result.messages[1].content);
    console.log("\n" + "=".repeat(80));
    console.log(`📚 Retrieved ${result.retrivedDoc.length} documents`);
    console.log(`✅ Filtered to ${result.filteredDoc.length} relevant documents`);
    console.log(`🔍 Generated ${result.generateQuestions.length} search queries`);
    console.log("=".repeat(80) + "\n");



    // NOTE: since the "result" variable is inside the try-block we can not access it outside the try-block. Outside that, result => undefined.



    // Error handling to prevent crash.
} catch (error) {
    console.error("❌ Error occurred:", error);
    if (error instanceof Error) {
        console.error("Message:", error.message);
    }
}





// make it interactive
/*
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion() {
    rl.question('\n🤔 Ask a question (or type "exit"): ', async (question) => {
        if (question.toLowerCase() === 'exit') {
            console.log("👋 Goodbye!");
            rl.close();
            return;
        }

        try {
            const result = await app.invoke({ 
                messages: [new HumanMessage(question)] 
            });

            console.log("\n💡 ANSWER:\n");
            console.log(result.messages[1].content);
            
            askQuestion(); // Ask again
        } catch (error) {
            console.error("❌ Error:", error);
            askQuestion();
        }
    });
}

askQuestion();
*/




// visualize graph flow
// After building the graph
/*
import * as fs from 'fs';

// Generate graph visualization
const graphImage = await app.getGraph().drawMermaidPng();
const arrayBuffer = await graphImage.arrayBuffer();
fs.writeFileSync('graph_visualization.png', Buffer.from(arrayBuffer));
console.log("📊 Graph visualization saved to graph_visualization.png");
*/