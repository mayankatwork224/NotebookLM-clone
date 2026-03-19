import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { nonnegative } from "zod";

// Here the code is similar to graph3.ts


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
            // console.log("Previous Value:",previousValue);
            // console.log("Next Value:",nextValue);
            // console.log("-".repeat(30))

            return previousValue.concat(nextValue)
        },
    }),

})



// Create Nodes
const nodeA = (state: typeof StateAnotation.State) => {
    console.log(`Node A ${state.users}`);
    // return { users: ["Alex"] }  // A --> End
    // return { users: ["John"] }      // A --> B --> D --> END
    return { users: ["Chris"] }      // A --> C --> D --> END
}

const nodeB = (state: typeof StateAnotation.State) => {
    console.log(`Node B`);
    return { users: ["Salmon"] }
}

const nodeC = (state: typeof StateAnotation.State) => {
    console.log(`Node C`);
    return { users: ["Jarvis"] }
}

const nodeD = (state: typeof StateAnotation.State) => {
    console.log(`Node D`);
    return { users: ["Gwen"] }
}


// define router
const router = (state: typeof StateAnotation.State) => {

    console.log("Router is called")

    if (state.users.includes("John")) {
        return 'b';
    }

    if (state.users.includes("Chris")) {
        return 'c';
    }

    // Both are "if" meand both conditions are independent. There is no "elif" 
    return '__end__';


}



// Pass these Nodes to the graph and Create a Graph
const builder = new StateGraph(StateAnotation)
    .addNode("a", nodeA)
    .addNode("b", nodeB)
    .addNode("c", nodeC)
    .addNode("d", nodeD)
    .addEdge(START, "a")
    .addConditionalEdges("a", router)
    .addEdge("b", "d")
    .addEdge("c", "d")
    .addEdge("d", END)


//           | --> B --> |
// Start --> A           D --> End
//           | --> C --> |

const graph = builder.compile();



// OR you can do this way: instead of creating router , define the router here directly
// .addConditionalEdges("a",(state) =>{

//     return undefined
// })


// Invoke the graph
const baseResult = await graph.invoke({ aggregate: [], users: [] });
console.log("Base Result :", baseResult);
