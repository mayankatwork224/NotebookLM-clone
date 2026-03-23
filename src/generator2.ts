import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";

import z from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
import { ChatGroq } from "@langchain/groq";
import { queryVectorDB } from "./retriever2.ts"

import dotenv from 'dotenv';
import { reciprocalRankFusion } from "./RRF.js";
import { DocumentInterface } from "@langchain/core/documents";
import { response_generator_prompt } from "./prompt.js";

/*
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
marked.setOptions({
  renderer: new TerminalRenderer()
});
*/

import cliMarkdown from 'cli-markdown';


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
  model: "llama-3.1-8b-instant",   // It doesn't support structured output
  // model: "llama-3.3-70b-versatile",
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY
})





const query = "What is Prompt engineering"

// const result = await queryVectorDB(query)
// console.log(result)




// Approch 1
/*


const generate_question_prompt = PromptTemplate.fromTemplate(`
  You are AI search assistant.
  The user asked: {question}
  
  Step back and consider this qestion more broadly!
  1. Reframe it in general terms
  2. Idedntify the main themes or dimentions involved
  3. Generate 5 diverse search queries that cover these dimentions, ensuring-each query explores a different perspective or phrasing.

  Respond with valid JSON in this format:
  {{"questions": ["query1", "query2", "query3", "query4", "query5"]}}
  `)

// When you expect json response from the LLM 
// usually Groq/OpenAI APIs require word "JSON" or "json" to appear somewhere in your prompt. This ensures model knows it should output JSON. Without it the API(i.e. ChatGroq) rejects the request.






// We pass the "context" and "query" to prompt. The entire prompt we pass as query
const generateQuestionPrompt = await generate_question_prompt.invoke({
  question: query,    
  // context: result[0]?.pageContent  // Now, we don't have context in our prompt not need to passs
});






const llmResult = await llm.invoke([{
    role: "user",
    content: generateQuestionPrompt.value
}],{
    response_format: {
      
      // ======= Some models doesn't support json schema =======
      // json_schema: {                        // Groq expects json_schema (not schema)
      //   name: "generate_questions",         // ← usually required by Groq / OpenAI-like APIs
      //   strict: true,                       // optional but recommended
      //   schema: zodToJsonSchema(responseSchema as any)
      // }

      type: "json_object",

    }
  })

// console.log('Questions :',llmResult["content"]);

// ============ need to write lot of boiler plate code to make the output structured ==========
const raw = llmResult.content;  // your full string

// Remove common markdown fences if present
let cleaned = raw  .replace(/^```json\s* /i, '').replace(/```$/i, '').trim();
  // Here * / parser fools the JS multiline comment so,  i just replace add a space in between * /   Remove it when you execute the code. To correcly run the code

// Extract only the array part
const match = cleaned.match(/"questions"\s*:\s*(\[[\s\S]*?\])/);
if (match && match[1]) {
  try {
    const questions = JSON.parse(match[1]);
    console.log(questions);           // ← the clean array you want
    // or if you want it as JSON string:
    // console.log(JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error("Could not parse the questions array:", err);
    console.log("Extracted fragment was:", match[1]);
  }
} else {
  console.error("Could not find questions array in the response");
};

*/






// Approch 2

const generate_question_prompt = PromptTemplate.fromTemplate(`
  You are AI search assistant.
  The user asked: {question}
  
  Step back and consider this question more broadly!
  1. Reframe it in general terms
  2. Identify the main themes or dimensions involved
  3. Generate 5 diverse search queries that cover these dimensions, ensuring each query explores a different perspective or phrasing.
  
  Respond with valid JSON in this format:
  {{"questions": ["query1", "query2", "query3", "query4", "query5"]}}
`);

const generateQuestionPrompt = await generate_question_prompt.invoke({
  question: query,    
});

const responseSchema = z.object({
  questions: z.array(z.string())
});

const llmResult = await llm.invoke([{
    role: "user",
    content: generateQuestionPrompt.value
}], {
    response_format: {
      type: "json_object",
    }
});

// ✅ Parse and validate the response

// console.log(llmResult)  // content : { questions : [...] }

const parsedResponse = JSON.parse(llmResult?.content as string);
// console.log(`parsedResponse: ${parsedResponse}`) // [object object]

//When you use template literrals `${}` javascript calls .toString() []eg. parsedResponse.toString()] method internally and that's why it gives [object object]
// console.log("parsedResponse:",parsedResponse?.questions) 


//========= I don't think this is required anymore =========
// const validatedData = responseSchema.parse(parsedResponse);
// console.log('Questions:', validatedData.questions);


//"?." operator. It is used with JS object. 
//If object is null or undefined then the ?. will immediately returns undefined.
//Otherise proceeds with the property you want to access or function call.


const allRetrivedDocs: DocumentInterface<Record<string, any>>[] = []

const questions = parsedResponse?.questions 
// since parsed questions is array
for(const question of questions){  
  // Inside the loop we don't want the change the "question" even not by mistake that's why "const"
  // After each iteration question variable get destroyed. New "const question" variable is created  and assign a value from array of questions 

  const result = await queryVectorDB(question);
  allRetrivedDocs.push(result)


}

// console.log("=".repeat(50))
// console.log(allRetrivedDocs)

const fusedResult = reciprocalRankFusion(allRetrivedDocs);
const fusedDoc = fusedResult.map(item => item.doc).filter(Boolean) as DocumentInterface<Record<string, any>>[];

// console.log(fusedDoc)

const docToString = formatDocumentsAsString(fusedDoc)


const generatorResPrompt = await response_generator_prompt.invoke({
  original_question: query,
  questions: questions.join(","),
  retrieved_docs: docToString
})



const aiResponse = await llm.invoke([{
    role: "user",
    content: generatorResPrompt.value
}])

let output = cliMarkdown(aiResponse["content"] as string)
console.log(output);
