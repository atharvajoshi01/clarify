import { streamText, convertToModelMessages, UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

const FALLBACK_MODELS = [
  "deepseek/deepseek-chat-v3.1:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
];

const PRIMARY_MODEL =
  process.env.CLARIFY_MODEL ?? FALLBACK_MODELS[0];

const MODEL_CHAIN = [
  PRIMARY_MODEL,
  ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL),
];

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "OPENROUTER_API_KEY is not set. Add it in Vercel project Settings → Environment Variables and redeploy.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const { messages }: { messages: UIMessage[] } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter(MODEL_CHAIN[0], {
      models: MODEL_CHAIN.slice(1),
    }),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    onError: ({ error }) => {
      console.error("[clarify] streamText error:", error);
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("[clarify] toUIMessageStreamResponse error:", error);
      if (error instanceof Error) return `${error.name}: ${error.message}`;
      return typeof error === "string" ? error : JSON.stringify(error);
    },
  });
}
