



// ------------------------------------------------------------------------------
//   Exactly same code as story_guide.ts , The only thing we change here "Prompts"
// ------------------------------------------------------------------------------

// Things we modify
// - mapPrompt
// - reducePrompt



// Remove this import entirely:
// import { collapseDocs, splitListOfDocs } from "langchain/chains/combine_docs";

// Replace with your own implementations:

function splitListOfDocs(
  docs: Document[],
  lengthFunc: (docs: Document[]) => Promise<number>,

  tokenMax: number,
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
  combineFunc: (input: Document[]) => Promise<string>,
): Promise<Document> {
  const result = await combineFunc(docs);
  return new Document({ pageContent: result });
}

import { Document } from "@langchain/core/documents";
import { StateGraph, Annotation, Send } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { ChatGroq } from "@langchain/groq";
import { llm } from "./chatmodel/index.js";


import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
  debug: false,
});

const loader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
);

const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splitDocs = await textSplitter.splitDocuments(docs);

/*
const llm = new ChatGroq({
    // model: "llama-3.1-8b-instant",
    // model: "llama-3.3-70b-versatile",
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY,
});
*/

// let tokenMax = 1000;
let tokenMax = 5000;

function approximateTokens(text: string): number {
  // Roughly:  1 token ≈ 4 characters (English text)

  return Math.ceil(text.length / 4);
}

async function lengthFunction(documents: Document[]) {
  const tokenCounts = documents.map((doc) =>
    approximateTokens(doc.pageContent),
  );

  return tokenCounts.reduce((sum, count) => sum + count, 0);
}

const OverallState = Annotation.Root({
  contents: Annotation<string[]>,

  summaries: Annotation<string[]>({
    reducer: (state, update) => state.concat(update),
  }),

  collapsedSummaries: Annotation<Document[]>,

  finalSummary: Annotation<string>,
});

// This will be the state of the node that will "map" all document in order to generate summaries
interface SummaryState {
  content: string;
}

const generateSummary = async (
  state: SummaryState,
): Promise<{ summaries: string[] }> => {
  const mapPrompt = ChatPromptTemplate.fromMessages([
    ["user", 
      `
      Create a set of FAQs (question and answers) from the following text.

      Each FAQ should include:
      - A clear question
      - A concise, accurate answer

      Format as a list of Q&A:\n\n{content}
      `
    ],
  ]);

  const prompt = await mapPrompt.invoke({ content: state.content });
  const response = await llm.invoke(prompt);

  return { summaries: [String(response.content)] };
};

const mapSummaries = (state: typeof OverallState.State) => {
  return state.contents.map(
    (content) => new Send("generateSummary", { content }),
  );
};

const collectSummaries = async (state: typeof OverallState.State) => {
  return {
    collapsedSummaries: state.summaries.map(
      (summary) => new Document({ pageContent: summary }),
    ),
  };
};

// ✅ Fixed
async function _reduce(input: Document[]): Promise<string> {
  const reducePrompt = ChatPromptTemplate.fromMessages([
    [
      "user",
      `The following are FAQs generated from different sections:
      {docs}

      Create a final, polished FAQ document by:
      - Combining duplicate or similar questions into single, comprehensive entries
      - Grouping related questions together
      - Ensuring all answers are accurate and complete
      - Ordering from most fundamental to more specific questions
      
      Format as a clean list of Q&A pairs.
      `,
    ],
  ]);
  // Distill = शुद्ध करना
  const docString = input.map((doc) => doc.pageContent).join("\n\n");
  const prompt = await reducePrompt.invoke({ docs: docString });
  const response = await llm.invoke(prompt);
  return String(response.content);
}

const collapseSummaries = async (state: typeof OverallState.State) => {
  const docLists = splitListOfDocs(
    state.collapsedSummaries,
    lengthFunction,
    tokenMax,
  );

  const results = [];
  for (const docList of docLists) {
    results.push(await collapseDocs(docList, _reduce));
  }
  return { collapsedSummaries: results };
};

async function shouldCollapse(state: typeof OverallState.State) {
  const numTokens = await lengthFunction(state.collapsedSummaries);

  // ✅ FIX 1: Check if we have only 1 document OR can't reduce further
  if (state.collapsedSummaries.length <= 1) {
    console.log(`✅ Final collapse: ${state.collapsedSummaries.length} document(s), ${numTokens} tokens`);
    return "generateFinalSummary";
  }

  // ✅ FIX 2: If tokens are within limit, proceed to final summary
  if (numTokens <= tokenMax) {
    console.log(`✅ Within token limit: ${numTokens} <= ${tokenMax}`);
    return "generateFinalSummary";
  }

  // ✅ FIX 3: Need to collapse more
  console.log(`🔄 Collapsing: ${state.collapsedSummaries.length} docs, ${numTokens} tokens`);
  return "collapseSummaries";
}

const generateFinalSummary = async (state: typeof OverallState.State) => {
  const response = await _reduce(state.collapsedSummaries);
  return { finalSummary: response };
};

// Construct Graph

const graph = new StateGraph(OverallState)
  .addNode("generateSummary", generateSummary)
  .addNode("collectSummaries", collectSummaries)
  .addNode("collapseSummaries", collapseSummaries)
  .addNode("generateFinalSummary", generateFinalSummary)

  .addConditionalEdges("__start__", mapSummaries, ["generateSummary"])
  .addEdge("generateSummary", "collectSummaries")
  .addConditionalEdges("collectSummaries", shouldCollapse, [
    "collapseSummaries",
    "generateFinalSummary",
  ])
  .addConditionalEdges("collapseSummaries", shouldCollapse, [
    "collapseSummaries",
    "generateFinalSummary",
  ])
  .addEdge("generateFinalSummary", "__end__");

const app = graph.compile();

let finalSummary = null;

for await (const step of await app.stream(
  { contents: splitDocs.map((doc) => doc.pageContent) },
  { recursionLimit: 10 },
)) {
  console.log(Object.keys(step));
  if (step.hasOwnProperty("generateFinalSummary")) {
    finalSummary = step.generateFinalSummary;
  }
  // if ("generateFinalSummary" in step) {
  //     finalSummary = step.generateFinalSummary.finalSummary;
  // }
}

console.log("final summary:", finalSummary);
