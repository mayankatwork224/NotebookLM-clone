import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

// Update different fields of State
// Here the code is similar to graph1.ts (copied from graph1.ts and make changes)


const StateAnotation = Annotation.Root({

	aggregate: Annotation<string[]>({
		reducer: (x, y) => x.concat(y),
	}),


	//  Define another state here

	currentNode: Annotation<string>({
		default: () => "",


		reducer: (previousVal, nextVal) => previousVal ? previousVal : nextVal, // reducer allow to modify the value of the state
	}),

	nextNode: Annotation<string>({
		default: () => "",
		reducer: (previousVal, nextVal) => previousVal ? previousVal : nextVal,
	}),
	users: Annotation<string[]>({
		default: () => [],
		reducer: (previousValue, nextValue) => {
			console.log("Previous Value:",previousValue);
			console.log("Next Value:",nextValue);
			console.log("-".repeat(30))
			
			return previousValue.concat(nextValue)
		},
	}),

})



// Create Nodes


const nodeA = (state: typeof StateAnotation.State) => {
	return { users: ["I'm A"] }
}

const nodeB = (state: typeof StateAnotation.State) => {
	return { users: ["I'm B"] }
}

const nodeC = (state: typeof StateAnotation.State) => {
	return { aggregate: ["I'm C"] }
}

// const nodeD = (state: typeof StateAnotation.State) => {
//   console.log(`Adding I'm D to ${state.aggregate}`);
//   return {aggregate : ["I'm D"]}
// }



// Pass these Nodes to the graph and Create a Graph
const builder = new StateGraph(StateAnotation)
	.addNode("a", nodeA)
	.addNode("b", nodeB)
	.addNode("c", nodeC)
	.addEdge(START, "a")
	.addEdge("a", "b")
	.addEdge("b", "c")
	.addEdge("c", END)


const graph = builder.compile();




// Invoke the graph
const baseResult = await graph.invoke({ aggregate: [], users: [] });
console.log("Base Result :", baseResult);


// This is somehow we can dry-run the entire code and see what things happening.
// Since langchain/langgraph are very highlevel framework it is very important to understand what happens internally. otherwise the code become hard to debug and unexpected errors