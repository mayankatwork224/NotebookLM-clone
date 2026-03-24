import { StateGraph, START, END, Annotation  } from "@langchain/langgraph";

const StateAnotation = Annotation.Root({
 
  aggregate : Annotation<string[]>({
    // default : () => [], // default value. If you don't specify the default value b
    reducer: (x,y) => x.concat(y),
  })


  // Defination of State: 
  // 1. It allows to know on which node we are
  // 2. we can use a state to store value inside of it 

/*
//  Define another state here

  currentNode : Annotation<string>({
    default : () => "",
    reducer: (previousVal,nextVal) => previousVal?previousVal:nextVal, // reducer allow to modify the value of the state
  }),
  
  nextNode: Annotation<string>({
    default : () => "",
    reducer: (previousVal,nextVal) => previousVal?previousVal:nextVal, 
  }),
  users: Annotation<string[]>({ // Change type to list of string
    default : () => [],         // default value equals to empty list
    reducer: (previousValue, nextValue) => previousValue.concat(nextValue),

    // Example
    // ["cherry"] , ["ben"] --> output: ["cherry", "ben"]
    
  })


*/
})



// Create Nodes
// Node is nothing byt a simple JS functions
// Each Node done it's task and return updated 

const nodeA = (state: typeof StateAnotation.State) => {
  console.log(`Adding I'm A to ${typeof state.aggregate}`);
  return {aggregate : ["I'm A"]}
}

const nodeB = (state: typeof StateAnotation.State) => {
  console.log(`Adding I'm B to ${state.aggregate}`);
  return {aggregate : ["I'm B"]}
}

const nodeC = (state: typeof StateAnotation.State) => {
  console.log(`Adding I'm C to ${state.aggregate}`);
  return {aggregate : ["I'm C"]}
}

const nodeD = (state: typeof StateAnotation.State) => {
  console.log(`Adding I'm D to ${state.aggregate}`);
  return {aggregate : ["I'm D"]}
}
// Every node take state as input and return a partialState(some updated part of state) that updates actual state. 

// Edges define the flow, the connection between two nodes, the execution.



// Pass these Nodes to the graph and Create a Graph
const builder = new StateGraph(StateAnotation)  
	.addNode("a",nodeA)
	.addNode("b",nodeB)
	.addNode("c",nodeC)
	.addNode("d",nodeD)
	.addEdge(START, "a")
	.addEdge("a","b")
	.addEdge("b","c")
	.addEdge("c","d")
	.addEdge("d", END);


const graph = builder.compile();

// The time you compile the graph that time it will interanlly connect all together(State, Nodes, Edges)
// Without compilation Nodes are returning the State(Updates the state), But they don't have the actual Satate Class access. So, they don't know: how to access value, what to update, etc.. 

// Compile step forms an graph, connect things together, make it executable. So that we can execute it 
/*
START --> A --> B --> C --> END
*/



// Invoke the graph
const baseResult = await graph.invoke({aggregate : []});
console.log("Base Result :",baseResult);