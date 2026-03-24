
// Modern example

import { StateSchema, MessagesValue, StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config({ path: '../.env', debug: false });

const API_KEY = process.env.TAVILY_API_KEY;
if (!API_KEY) {
  throw new Error("TAVILY_API_KEY is not set in .env");
}

// Define state
const State = new StateSchema({
  messages: MessagesValue,
});

// Q. Here how the state is concat each time and not override
// Answer: MessageValue is not just a type - it is a state reducer that tells the grapg how to update the state when new data arrives


/* Understand "MessageValue"

1. default behaviour
```
const State = new StateSchema({
  messages: [],
});
```

When a node returns: return { messages: ["Hello"] }
The state becomes  : messages = ["Hello"]

next node returns : return { messages: ["How are you?"] }
The state becomes : messages = ["How are you?"]

So it overrides.


2. with "MessageValue"
```
const State = new StateSchema({
  messages: MessagesValue,
});
```

The field should append new messages instead of replacing them. 

When a node returns: return { messages: ["Hello"] }
The state becomes  : messages = ["Hello"]

next node returns : return { messages: ["How are you?"] }
The state becomes : messages = ["Hello", "How are you?"]

So it concatenates automatically.




Inetanally what happens: Conceptually[No-code example] Message value works like this reducer:
```
function reducer(old_state, new_value) {
  return [...old_state, ...new_value];
}
```

Sometimes, Things like MesssageValue containns low-level code. Hard to understand. What we need to understand the concept and start using it. 

state.messages = old_messages + new_messages

This makes LnagGraph ideal for agent workflows: tool calls, assistant response, user message, intermediate reasoning.

*/

/* Ways to Define state

1. MessageValue
```
const State = new StateSchema({
  messages: MessagesValue,
});
```

"MessagesValue" -> It is pre-built reducer for chat messages

You're telling LangGraph: "This field contins chat messages and should automatically accumulate(concat) them"

"MessageValue" is 'predefined state handler' designed specifically for LLM conversation history. Internally it already knows how to append message


2. Annotations 
```
const StateAnnotation = Annotation.Root({
  aggregate: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
  })
})
```
Here you're manually defining how the state merges. This is low-level flexible system that LangGraph uses


- Annotation.Root({}) --> Define the structure of the state object
- Annotation<string[]> --> Define datatype, reducer, default value(optional)
- reducer: This defines how state updates

-----------------------------------------------

MessageValue
- High level
- Purpose: Chat message history
- Limited customization
- Use when storing: HumanMessage, AIMessage, ToolMessage,  ChatHistory

Annotation
- Low level
- Purpose: Generic state fields
- Fully customizable
- Use when storing: documents, tool output, counters, tokens, reasoning steps, embeddings


--------------------------------------

In modern code you see "MessageAnnotation" instead of "MessageValue".

Both does exactly same thing.

1. MessageValue
- old langgraph API
- Used with : `StateSchema`

```
const State = new StateSchema({
  messages: MessagesValue,
});
```
"MessageValue" creates a new state field. it's default value = []. It's reducer = append new messages. 



2. MessageAnnotation
- New langgraph API
- Used with : Annotation.Root

```
const State = Annotation.Root({
  messages: MessagesAnnotation
});
```
- store chat history. Automatically concatenates messages 



> New langGraph recommends the Annotation system, so "MessageAnnotation" is the modern way. 

*/


// Create Groq LLM
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile", 
  temperature: 0.4, 
});



// Node that calls the LLM
const llmNode = async (state: typeof State.State) => {
  const response = await llm.invoke(state.messages);

  return {
    messages: [response],
  };
};

// Build graph
const graph = new StateGraph(State)
  .addNode("llm", llmNode)
  .addEdge(START, "llm")
  .addEdge("llm", END)     // END is constant that internally represent a string "__end__"
  .compile();

// Run graph
const result = await graph.invoke({
  messages: [new HumanMessage("hi!")],
});

// console.log(result.messages[-1].content); // In Javascript -1 is treated as property name 
                                              // In Node.js we can not use the negetive inde

// console.log(result.messages[result.messages.length - 1].content); // Javascriot // Works ✅
// console.log(result.messages.at(-1).content);    // Node.js specific

/*

In Javascript you can use the indexes to access the elements inside the array. But it not natively supports negetive indexes such like some other language (like Python)

instead of : message[-1] you can use message[message.length - 1] // This mimic/simulates negetive indexing

*/


/*
// For LangGraph to print full conversation nicely
result.messages.forEach(m => {
  console.log(`${typeof m._getType()}: ${m.content}`);
});
*/


// Generally an array-like iterable has method forEach() in javascript

// _getType() is method provided langchain/langgraph library on AIMessage(), HumanMessage(), etc.
// This is not native method supported by javascript. With javascript we can use the keyword "typeof" but it just say "object"

// The _getType() method is deprecated still works, Instead of it langchain recommeds to use isAIMessage() method and pass Message-object to it, and it will return boolean value. 


// In Future if it not works and give deprecation message then use below code 

import { 
  // HumanMessage,   // Already imported above (To avoid duplicated import error. comment it )
  AIMessage 
} from "@langchain/core/messages";


result.messages.forEach(m => {
  if (m instanceof HumanMessage) {
    console.log(`Human \t: ${m.content}` );
  } else if (m instanceof AIMessage) {
    console.log(`AI \t: ${m.content}` );
  }
});


/*

Because the language code has different features/functionality it contains different things

The code may differ,

But the concept of langchain i.e. LLM, invoke() that remains same.

syntax definitely change, techniques definitely chang. Because entire languge is changed. 

--------------------------------------

When it comes to Python and Typescript

There will be a lot difference. Because the main difference is, 
- Python is dynamically typed and In JS you need to use let/var/const also here we use JS+TS(so scray)


*/