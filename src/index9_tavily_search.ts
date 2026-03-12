import { TavilySearch } from "@langchain/tavily";
import { ChatGroq, messageToGroqRole } from "@langchain/groq";
import dotenv from 'dotenv';
import {HumanMessage, tool} from "langchain";
import z, { number } from "zod";
import { RunnableLambda } from "@langchain/core/runnables";
dotenv.config({ path: '../.env', debug: false });


// Add markdown Preview support
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";

marked.setOptions({
  renderer: new TerminalRenderer()
});


const API_KEY = process.env.TAVILY_API_KEY;
if (!API_KEY) {
  throw new Error("TAVILY_API_KEY is not set in .env");
}

const tavilySearch = new TavilySearch({
  maxResults: 5,
  topic: "general",
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});




// --------------------------------------
// create custom tool
// --------------------------------------

// When we create a custom tool, we need to specify the name and description of the tool. 

const multiply = tool(
    ({a,b}:{a:number, b:number}): number => {
        /**
         * Multiply a and b
         */
        return a * b;

    },
    {
        name : "multiply",
        description: "Multiply two numbers",
        schema : z.object(
            {
                a : z.number(),
                b : z.number(),
            }
        ),
    }
)


const tavilytool = tool(
    async ({query}) => {
        const result = await tavilySearch.invoke({query: query});
        return result;

    }, {
        name : "tavily_search",
        description: "Search the web using Tavily to find real-time information.",
        schema : z.object(
            {
                query: z.string(),
            }
        ),
    }
)





const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile", 
  temperature: 0.4, 
});



const chain = await llm.bindTools([multiply, tavilytool]);


// const result = await chain.invoke(
//     [
//         new HumanMessage("What is the current weather in the new york ?")
//     ]
// );

//     console.log(result);
//  you see it returns tool call of tavily_search tool

// Here the console.log() having some space[indent] in starting still works
// Bro! It is not Python where indentation plays a big role. here only semicolon matters. 

const toolChain = RunnableLambda.from(async (userInput:string) => {
    const hummanMessage = new HumanMessage(userInput)
    

    const aiMsg = await chain.invoke(
        [
            // messages: [ new HumanMessage(userInput)]  // This line doesn't work ChatGroq

            // ChatGroq expects
            new HumanMessage(userInput)
        ],
    );


    // If not tool call return the AI message directly
    if (!aiMsg.tool_calls || aiMsg.tool_calls.length === 0) {
        return aiMsg;
    }



    const toolMap: Record<string, any> = {
        multiply: multiply,
        tavily_search: tavilytool,
    }; 

    
    const toolMsgs = [];
    for (const toolCall of aiMsg.tool_calls) {
        const selectedTool = toolMap[toolCall.name];
        if (selectedTool) {
            const toolResult = await selectedTool.invoke(toolCall);
            toolMsgs.push(toolResult);
        }
    }

        // Step 4: Send the FULL conversation back to LLM so it can
    //         generate a natural language response from the tool results
    const finalResponse = await chain.invoke([
        userInput,      // original user question
        aiMsg,             // AI's tool call decision
        ...toolMsgs,       // tool results
    ]);

    return finalResponse;  // <-- THIS WAS MISSING

   

    // console.log(toolMsgs) // After tool call response
});


const result = await toolChain.invoke('What is current wheather in New York ?');
// console.log(marked(result["content"]))
console.log("result : ",marked(result.content));