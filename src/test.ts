import { StateGraph, Annotation, Send } from "@langchain/langgraph";


// Define the state ( data structure )
const ChainState = Annotation.Root({
    generate: Annotation<`jokes`|`comments`>, // what to generate
    subjects: Annotation<string[]>, // list of subject on which we will genrate joke or comment

    // String Array to store Comments and Jokes 
    comments: Annotation<string[]>({ 
        reducer: (a,b) => a.concat(b)
    }),
    jokes: Annotation<string[]>({
        reducer: (a,b) => a.concat(b)
    }),
    // 👉 reducer means: This function will get called when a new value is passed  or try to overridse comments. Inside reducer we can specify a callback that, in that callback we have two arguments previousValue(it's a) and newValue(it's b)
    // ['Comment1'] + ['Comment2'] → ['Comment1', 'Comment2']
})


// This is like router node 
// It will deice for each subject what should it generate either joke or comment.
const whatToGenrate = async (state: typeof ChainState.State) => {

    return state.subjects.map((subject) => { // Pick one element from array of string 

        const node = state.generate === 'comments' ? 'generateComment' : 'generateJoke';
        // Here, surely === will have more precedence that's why it evaluate first then the assigment operator (=) will evaluate
        
        // return new Send(node, {subjects : [subject]})
        return new Send(node, {subjects : [subject], end: "..........end text"})

        // So, even if we don't have the "end" property inside the State
        // Using the Send() we can inject the property to the state and access in nodes


        // Explanation

        // Send() will sends the data to another node (function) to process the data


        // "node" decides where to send 
        // { subjects: [subject] } ==> This is the data you sned
        // we pass an array ( [subject] ) because the subjects kye has value  
    })

    // Since here you've used the map() method and inside that you use the Send()
    

    // This creates multiple Send
    // Send('generateComment', { subjects: ['cats'] })
    // Send('generateComment', { subjects: ['dogs'] })


    // Send() is how you do parallel execution aka. Branching.

    // Instead of function that does everything, You split the work into multiple small tasks(Workers)


    /*
    
    ---------------- Work-Flow ----------------

    START
    ↓
    whatToGenerate
    ↓
    ├── Send → generateComment (cats)
    └── Send → generateComment (dogs)
            |
    [ each node get a small input ]
            ↓
    results combined

    */

    //Send = split work + route it to a node

}


// Normal function call 
// - One function call, One input, One output
// - Everything handled in one place
/*
    START → generateComment → END
         (handles all subjects)
*/

// Send()
// - instead of one call -> you can create multiple independent calls
// - if two Send() calls, Work split into 2 tasks
// - conceptually Parallel exeuction. But in reality, Not strict simultaneous always but they have independent execution paths
// - It gives individual outputs and then Merge(Reducer magic)
// Work happen faster and cleaner


// With Send() each node gets its own mini-stae
// { subjects: ['cats'] }

// Not the full : { subjects: ['cats', 'dogs'] } that you passed to the graph.invoke()

// 👉 Think of Send() as: “Spawn a mini-execution for each item and send it to a worker node”
// many independent tasks



// Send() eanbles map-reduce style pipelines ( like MapReduce inside LangGraph )


// Common debugging used with Send()
// - log inside the whatToGenerate() router function
// - log inside every node
// common bug
// - send array from node
// - typo
// - wrong reducer function
// - 

const generateComment = async (state: typeof ChainState.State) => {

    // Debugging
    // console.log(`send data: ${state.subjects}` ); 
    // Do not use that, it will use toString() method internally.
    console.log(`send data: `, state.subjects );
    

    // You can access the injected property "end" using the state
    console.log(state.end )
    // You can even pass "state.end" to the return statement. To send data to another node. 


    return {
        comments: [`Comment about ${state.subjects}`]
    }
}

const generateJoke = async (state: typeof ChainState.State) => {
    return {
        comments: [`Joke about ${state.subjects}`]
    }
}



// Create a graph
const graph = new StateGraph(ChainState)
    .addNode("generateJoke", generateJoke)
    .addNode("generateComment", generateComment)

    .addConditionalEdges("__start__", whatToGenrate, ['generateComment', 'generateJoke'])
    .addEdge('generateJoke','__end__')
    .addEdge('generateComment','__end__')

    .compile()

// const res = await graph.invoke({
//     subjects: ['cats', 'dogs'],
//     generate: "comments"
// })

// console.log(res)



// console.dir(res)
// console.dir(res, {depth: null})

// console.dir() prints the object as a full expandable tree. Show all nested levels. No traction. Best for debugging dee stucture.  
//{depth: null} This tells Node.js "show Everything, no limit"

// you won't see output like 
/*

{
  subjects: [ 'cats', 'dogs' ],
  comments: [ [Array] ]
}

or 

comments: [ [Object], [Object] ]
*/



// Use stream() in order to observe the execution of the graph
for await (const step of await graph.stream(
    {subjects: ['cats', 'dogs'],generate: "comments"},
    {recursionLimit: 10}
)){
    console.log("s :" , step)
    console.log("stop :", Object.keys(step));
    
}
