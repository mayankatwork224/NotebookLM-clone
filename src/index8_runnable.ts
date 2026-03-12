import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables"


const func1 = (x:string) => x.toString()

const runnable1 = RunnableLambda.from(func1)
const runnable2 = RunnableLambda.from((x: string) => x.toLocaleUpperCase())
const runnable3 = RunnableLambda.from((x:string) => x.slice(0,2))


// const result = await runnable1.invoke("Hello")
// console.log(result)


const chain = new RunnableSequence(
    {
        first : runnable1,
        middle : [runnable2],
        last : runnable3
    }
)

const result = await chain.invoke("Hello")

console.log(result)


const batch_result = await chain.batch(["hello","dog","banana"])
console.log(batch_result);
// For all of them the runnable sequence run parallely and give combined result.
// This how .batch() function works. 

// async function returns promise. we need to make it pause. so we need to add "await"


// tsx index8_runnable.ts