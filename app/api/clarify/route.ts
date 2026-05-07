import { streamText, convertToModelMessages, UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

const MODEL_ID =
  process.env.CLARIFY_MODEL ?? "meta-llama/llama-3.3-70b-instruct:free";

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

  const result = streamText({
    model: openrouter(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
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
