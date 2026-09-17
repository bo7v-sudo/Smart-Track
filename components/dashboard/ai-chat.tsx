'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Paperclip,
  Mic,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiSuggestions } from '@/lib/dashboard-data';

type ChatMessage = {
  id: number;
  role: 'user' | 'ai';
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 0,
    role: 'ai',
    text: "Hey Alex! I am your AI study assistant. I can summarize lectures, build study plans, generate quizzes, and predict your GPA. What do you need help with today?",
  },
];

export function AIChat({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: getAIResponse(text),
        },
      ]);
    }, 1300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 z-[70] flex h-screen w-full max-w-md flex-col border-l border-border bg-card/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">AI Study Assistant</p>
                  <p className="flex items-center gap-1 text-xs text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close chat"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {typing && <TypingIndicator />}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="border-t border-border px-4 pb-2 pt-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/30 p-2 focus-within:border-primary/50">
                <button
                  aria-label="Attach"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Paperclip className="h-[18px] w-[18px]" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything about your courses..."
                  className="max-h-28 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/70"
                />
                <button
                  aria-label="Voice"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Mic className="h-[18px] w-[18px]" />
                </button>
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
                AI can make mistakes. Check important info before relying on it.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold',
          isUser
            ? 'bg-muted text-foreground/70'
            : 'bg-gradient-to-br from-primary to-accent text-primary-foreground',
        )}
      >
        {isUser ? 'A' : <Sparkles className="h-4 w-4" />}
      </span>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted/60 text-foreground',
        )}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          />
        ))}
      </div>
    </div>
  );
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('gpa')) {
    return "Your predicted GPA this semester is 3.74, up 0.21 from last month. You're trending toward Dean's List! The biggest lever right now is Data Structures — bringing that C+ up to a B would lift your GPA to 3.82.";
  }
  if (lower.includes('quiz')) {
    return "I can generate a quiz from any lecture, chapter, or your weak spots. Based on your last quizzes, carbonyl reactions and eigenvalues are your top two gaps. Want me to create a 15-question quiz on those now?";
  }
  if (lower.includes('plan') || lower.includes('study')) {
    return "Here's what I recommend for today: 1) Review carbonyl reactions (45 min) — your midterm is in 4 days. 2) Finish Problem Set 4 for Linear Algebra (60 min). 3) Read Chapter 8 on Binary Trees (40 min). Your focus peaks at 4 PM, so tackle the hardest task then. Shall I add these to your tasks?";
  }
  if (lower.includes('summar')) {
    return "Sure! Upload a lecture recording, PDF, or paste your notes and I'll extract the key concepts, definitions, and takeaways into a clean summary you can review in minutes. Which course is it for?";
  }
  return "Great question! I can help with summaries, study plans, quizzes, GPA predictions, and explaining concepts. Could you tell me a bit more about what you're working on so I can give you the best answer?";
}
