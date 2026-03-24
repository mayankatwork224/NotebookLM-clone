import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { Serialized } from "@langchain/core/load/serializable";
import { llm } from "./index.js";

// Create a proper callback handler class
class LoggingHandler extends BaseCallbackHandler {
  name = "LoggingHandler";

  async handleLLMStart(
    llm: Serialized,
    prompts: string[],
    runId: string
  ): Promise<void> {
    // Access model name from serialized object
    const modelName = 
      llm.kwargs?.model || 
      llm.kwargs?.modelName || 
      llm.id?.[llm.id.length - 1] ||
      "Unknown Model";

    console.log("🔍 LLM Object:", JSON.stringify(llm, null, 2));    
    console.log(`✅ Trying model: ${modelName}`);
    console.log(`📝 Prompt: ${prompts[0]?.substring(0, 50)}...`);
  }

  async handleLLMError(
    error: Error,
    runId: string
  ): Promise<void> {
    console.error(`❌ Model failed (Run: ${runId}):`, error.message);
  }

  async handleLLMEnd(output: any, runId: string): Promise<void> {
    console.log(`✅ Model succeeded (Run: ${runId})`);
  }
}

const loggingHandler = new LoggingHandler();

const response = await llm.invoke(
  "Explain AI",
  { callbacks: [loggingHandler] }
);

console.log(response.content);