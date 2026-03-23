import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

export const generate_question_prompt = PromptTemplate.fromTemplate(`
  You are AI search assistant.
  The user asked: {question}
  
  Step back and consider this question more broadly!
  1. Reframe it in general terms
  2. Identify the main themes or dimensions involved
  3. Generate 5 diverse search queries that cover these dimensions, ensuring each query explores a different perspective or phrasing.
  
  Respond with valid JSON in this format:
  {{"questions": ["query1", "query2", "query3", "query4", "query5"]}}
`);


export const response_generator_prompt = PromptTemplate.fromTemplate(`
    We exposed this into several related queries to cover different perspectives:
    {questions}

    We retrive the following documents based on these queries:
    {retrieved_docs}

    Your task:
    1. Step back and consider the original question in a broad, general sense.
    2. Review the retrieved information across all queries carefully.
    3. Synthesize a single, coherent answer that directly addresses the user's original question
    4. If different queries highlight different aspects, integrate them into one clear explanation
    5. Be concise, structured, and clear. When useful, cite or reference information from the retrieved docs. 


    You must respond in JSON format with the following structure:
    {{
        "reasoning": "your step-by-step thought process here",
        "answer": "your final answer here"
    }}
    
    Provide your response as valid JSON only.


`)


export const grade_doc_prompt = ChatPromptTemplate.fromTemplate(
    `You are grader assessing relavance of a retrived document to a user question.
    Here is the retrieved document
    {context}
    
    Here is the user question: {question}

    If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. 
    Give a binary score 'yes' or 'no' score to indicate wheather the doucment is relevant to the question.


    You must respond in JSON format with the following structure:
    {{
        "binaryScore": "yes"
    }}
    or
    {{
        "binaryScore": "no"
    }}

    Provide your response as valid JSON only.
    

    `
)

// Since the groq/openAI compatible models requires to mention json somewhere in the prompt


export const transform_query_prompt = ChatPromptTemplate.fromTemplate(
    `
    You are generating a question that is well optimized for semantic search retrieval
    Look at the input and try to reason about that underlying semantic intent / meaning

    {question}

    Formulate an improved question:
    `
)