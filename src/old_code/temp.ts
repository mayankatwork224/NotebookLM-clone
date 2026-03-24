import { HumanMessage, AIMessage } from "langchain";

let l1 =  [
        new HumanMessage("hi"),
        new AIMessage("Hi, How can i help you"),
        new HumanMessage("What is Python?")    
    ]

console.log(l1.slice(-1))       // returns array
console.log(l1.slice(-1)[0])    // return actual HumanMessage() instance only