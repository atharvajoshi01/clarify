"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, Sparkles } from "lucide-react";

const EXAMPLE_BRIEFS = [
  "An internal tool for our finance team to approve and track vendor invoices, with audit trails and Slack notifications.",
  "A patient intake portal for a small clinic that captures insurance details and pre-screens for risk factors before the visit.",
  "A learning platform where SMEs can publish micro-courses and learners get adaptive review reminders.",
];

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/clarify" }),
  });

  const submit = (text: string) => {
    if (!text.trim() || status !== "ready") return;
    sendMessage({ text });
    setInput("");
  };

  if (messages.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          <div className="flex flex-col gap-3 text-center">
            <Badge variant="secondary" className="self-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              AI Business Analyst
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Clarify
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Drop in a project brief. Get back requirements with unique IDs,
              a traceability matrix, test cases, and a RACI register. Asks
              before assuming.
            </p>
          </div>

          <Card className="p-3 gap-0 shadow-sm">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project. Who is it for, what should it do, what does success look like..."
              className="min-h-32 border-0 shadow-none focus-visible:ring-0 resize-none px-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  submit(input);
                }
              }}
            />
            <div className="flex items-center justify-between px-2 pt-2">
              <span className="text-xs text-muted-foreground">
                Cmd / Ctrl + Enter to send
              </span>
              <Button
                size="sm"
                onClick={() => submit(input)}
                disabled={!input.trim() || status !== "ready"}
              >
                <ArrowUp className="h-4 w-4" />
                Clarify
              </Button>
            </div>
          </Card>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Try an example
            </span>
            <div className="flex flex-col gap-2">
              {EXAMPLE_BRIEFS.map((brief) => (
                <button
                  key={brief}
                  onClick={() => submit(brief)}
                  className="text-left text-sm px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                >
                  {brief}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-semibold">Clarify</span>
        </div>
        <Badge variant="outline" className="capitalize">
          {status}
        </Badge>
      </div>
      <Separator />

      <ScrollArea className="flex-1 mt-4 pr-4">
        <div className="flex flex-col gap-6 pb-32">
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {m.role === "user" ? "You" : "Clarify"}
              </span>
              <Card className="p-4 whitespace-pre-wrap text-sm leading-relaxed">
                {m.parts.map((part, i) =>
                  part.type === "text" ? (
                    <span key={i}>{part.text}</span>
                  ) : null,
                )}
              </Card>
            </div>
          ))}
          {error && (
            <Card className="p-4 border-destructive bg-destructive/10 text-sm">
              <div className="font-semibold text-destructive mb-1">Error</div>
              <pre className="whitespace-pre-wrap text-xs text-destructive/90">
                {error.message || String(error)}
              </pre>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="sticky bottom-4 mt-2">
        <Card className="p-3 gap-0 shadow-lg">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Answer the questions, or refine the brief..."
            className="min-h-20 border-0 shadow-none focus-visible:ring-0 resize-none px-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit(input);
              }
            }}
          />
          <div className="flex items-center justify-end pt-2">
            <Button
              size="sm"
              onClick={() => submit(input)}
              disabled={!input.trim() || status !== "ready"}
            >
              <ArrowUp className="h-4 w-4" />
              Send
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
