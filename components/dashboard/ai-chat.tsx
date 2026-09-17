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
    text: "Hi! I'm your AI assistant. I can help with anything — coding, writing, general knowledge, problem-solving, casual conversation, and of course academic and study help. What can I do for you today?",
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
                  <p className="text-sm font-semibold">AI Assistant</p>
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
                  placeholder="Ask me anything..."
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

  // Academic / study help (still works seamlessly when asked)
  if (lower.includes('gpa')) {
    return "Your predicted GPA this semester is 3.74, up 0.21 from last month. You're trending toward Dean's List! The biggest lever right now is Data Structures — bringing that C+ up to a B would lift your GPA to 3.82.";
  }
  if (lower.includes('quiz')) {
    return "I can generate a quiz from any lecture, chapter, or your weak spots. Based on your last quizzes, carbonyl reactions and eigenvalues are your top two gaps. Want me to create a 15-question quiz on those now?";
  }
  if ((lower.includes('plan') || lower.includes('study')) && lower.length < 80) {
    return "Here's what I recommend for today: 1) Review carbonyl reactions (45 min) — your midterm is in 4 days. 2) Finish Problem Set 4 for Linear Algebra (60 min). 3) Read Chapter 8 on Binary Trees (40 min). Your focus peaks at 4 PM, so tackle the hardest task then. Shall I add these to your tasks?";
  }
  if (lower.includes('summar') && lower.length < 60) {
    return "Sure! Upload a lecture recording, PDF, or paste your notes and I'll extract the key concepts, definitions, and takeaways into a clean summary you can review in minutes. Which course is it for?";
  }

  // General-purpose responses
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! How can I help you today? I can assist with coding, writing, research, math, general knowledge, casual conversation, or any academic topics you need help with.";
  }
  if (lower.includes('code') || lower.includes('program') || lower.includes('javascript') || lower.includes('python') || lower.includes('react') || lower.includes('bug')) {
    return "I'd be happy to help with coding! I can assist with writing code, debugging, explaining concepts, reviewing architecture, and more. Could you share the specific problem or code snippet you're working with?";
  }
  if (lower.includes('write') || lower.includes('essay') || lower.includes('email') || lower.includes('letter')) {
    return "I can help you write that! Whether it's an essay, email, cover letter, or creative piece, just give me the topic and any requirements (tone, length, audience) and I'll draft it for you.";
  }
  if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does')) {
    return "Great question! I can break down concepts in almost any field — science, history, technology, philosophy, economics, and more. Could you tell me which specific topic you'd like me to explain?";
  }
  if (lower.includes('math') || lower.includes('calculate') || lower.includes('solve') || lower.includes('equation')) {
    return "I can help you solve that math problem step by step. Share the equation or problem you're working on and I'll walk you through the solution with clear explanations.";
  }
  if (lower.includes('recipe') || lower.includes('cook') || lower.includes('food')) {
    return "I'd love to help with cooking! Tell me what ingredients you have or what dish you're thinking about, and I'll give you a recipe with step-by-step instructions.";
  }
  if (lower.includes('joke') || lower.includes('funny')) {
    return "Why don't scientists trust atoms? Because they make up everything! But seriously, I'm here for any question you've got — from quantum physics to the best pizza recipe. What else can I help with?";
  }
  if (lower.includes('translate')) {
    return "I can help with translation between many languages. Just provide the text and tell me which language you'd like it translated into!";
  }
  if (lower.includes('thank')) {
    return "You're welcome! Feel free to ask me anything else — I'm here to help with whatever you need.";
  }

  return "I'm here to help with anything you need — coding, writing, research, math, general knowledge, casual conversation, or academic and study support. What would you like to know or work on?";
}
