// export function extractMessage(state: typeof StateAnotation,messageType: "ai"|"human"){

import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
// This way we need to expeort the "StateAnotation" from the qa_overdoc.ts and import here. That becomes too much complex. especially just to handle type-annotation
// So for simplicity we use "any"

export function extractMessage(state: any, messageType: "ai" | "human") {
    const lastMessage = state.messages
        .filter((m: any) => m._getType() == messageType)
        .slice(-1)[0];

    /*
    [
        new HumanMessage("hi"),
        new AIMessage("Hi, How can i help you"),
        new HumanMessage("What is Python?")     <--- Pick the Last HumanMessage()
    ]
    */

    // console.log(l1.slice(-1))       // returns array
    // console.log(l1.slice(-1)[0])    // return actual HumanMessage() instance only

    return lastMessage
}

export const questionResponseFormater = {
    response_format: {
        type: "json_object",
    }
}

export const gradeDocResponseSchema = z.object({
  response_format: {
    type : "json_object",
    schema: zodToJsonSchema(
        z.object({
            binaryScore: z
            .enum(["yes","no"])
            .describe("Relevance score 'yes' or 'no'")
        })
        .describe(
            "Grade the relevance of the retrived documents to the question. Either 'yes' or 'no'."
        )
    )
  } 
});


export const TransformResponseFormatter = {
    response_format:{
        type:"json_object",
        schema:zodToJsonSchema
    }
}

export const generateResponseFormatter = {
    response_format:{
        type:"json_object",
        schema:zodToJsonSchema(
            z.object({
                reasoning: z.string(),
                answer: z.string()

            })
        )
    }
} as any

