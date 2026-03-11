"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { GradientOrb } from "@/components/ui/GradientOrb";
import {
  ArrowUpIcon,
  ArrowLeftIcon,
  Paperclip,
  ImageIcon,
  FileTextIcon,
  XIcon,
  Loader2Icon,
  MicIcon,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Types ----------

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  attachments?: AttachedFile[];
}

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  preview?: string;
  storage_path?: string;
  uploading?: boolean;
  error?: boolean;
}

// ---------- Constants ----------

const MAX_USER_MESSAGES = 25;

const WELCOME_MESSAGES = [
  "Hey there! I'm Lisa, your AI assistant from The AI Website Flow. I'll help gather everything our team needs to build you a professional website.",
  "This will only take about 2 minutes - just a quick chat!\n\nFirst things first, are you looking to build a brand new site or replace an existing one?",
];

// ---------- Quick reply parsing ----------

function parseQuickReplies(content: string): { text: string; replies: string[] } {
  const match = content.match(/\[QUICK_REPLIES:\s*(.+?)\]/);
  if (!match) return { text: content, replies: [] };
  const text = content.replace(/\[QUICK_REPLIES:\s*(.+?)\]/, "").trim();
  const replies = match[1].split("|").map((r) => r.trim()).filter(Boolean);
  return { text, replies };
}

// ---------- Auto-resize hook ----------

function useAutoResizeTextarea(minHeight: number, maxHeight: number) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    },
    [minHeight, maxHeight],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

// ---------- Notification sound ----------

function playMessageSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Silent fallback
  }
}

// ---------- Speech Recognition hook ----------

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
  resultIndex: number;
}

function useSpeechRecognition(onResult: (transcript: string) => void, getCurrentInput: () => string) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const inputBeforeRecording = useRef("");

  function createRecognition() {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    return recognition;
  }

  useEffect(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const start = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const prefix = inputBeforeRecording.current;
      const separator = prefix && !prefix.endsWith(" ") ? " " : "";
      onResult(prefix + separator + transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    inputBeforeRecording.current = getCurrentInput();
    recognition.start();
    setIsListening(true);
  }, [onResult, getCurrentInput]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return { isListening, isSupported, toggle };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// ---------- Web Agent Avatar ----------

function AgentAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-9 w-9" : "h-7 w-7";
  return (
    <div
      className={cn(
        dim,
        "shrink-0 rounded-full bg-gradient-to-br from-brand to-[#d44a1e] flex items-center justify-center",
        "shadow-[0_0_12px_rgba(242,86,35,0.2)]",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={size === "md" ? "h-4.5 w-4.5" : "h-3.5 w-3.5"}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

// ---------- Typewriter placeholder ----------

const PLACEHOLDER_LINES = [
  "I run a bakery and need a new website...",
  "We're a law firm looking for a modern site...",
  "I sell handmade jewelry and want an online store...",
  "I run a fitness studio and need more clients...",
  "I'm a photographer looking for a portfolio site...",
  "We're launching a SaaS product and need a landing page...",
];

function useTypewriterPlaceholder(lines: string[], active: boolean) {
  const [text, setText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;

    const line = lines[lineIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex <= line.length) {
      timeout = setTimeout(() => {
        setText(line.slice(0, charIndex));
        setCharIndex((c) => c + 1);
      }, 40 + Math.random() * 30);
    } else if (!isDeleting && charIndex > line.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setText(line.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 20);
    } else {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setLineIndex((i) => (i + 1) % lines.length);
        setCharIndex(0);
        setText("");
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [active, charIndex, isDeleting, lineIndex, lines]);

  return text;
}

// ---------- Main component ----------

export function ConversationIntake({ embedded = false }: { embedded?: boolean } = {}) {
  const [isChat, setIsChat] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const typewriterText = useTypewriterPlaceholder(PLACEHOLDER_LINES, !isChat && !isTransitioning);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea(44, 300);

  // Speech recognition
  const inputRef = useRef(input);
  inputRef.current = input;
  const getCurrentInput = useCallback(() => inputRef.current, []);
  const handleSpeechResult = useCallback(
    (transcript: string) => {
      setInput(transcript);
      adjustHeight();
    },
    [adjustHeight],
  );
  const { isListening, isSupported: speechSupported, toggle: toggleSpeech } = useSpeechRecognition(handleSpeechResult, getCurrentInput);

  // Bot protection: honeypot + timestamp
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef(Date.now());

  // Count user messages for rate limiting
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Transition: click/focus on intro textarea → expand to chat with welcome message
  function handleActivate() {
    if (isChat || isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setIsChat(true);
      setIsTransitioning(false);

      // Welcome messages appear with staggered delay
      setTimeout(() => {
        playMessageSound();
        setMessages([{ id: "welcome-0", role: "assistant", content: WELCOME_MESSAGES[0] }]);

        setTimeout(() => {
          playMessageSound();
          setMessages((prev) => [
            ...prev,
            { id: "welcome-1", role: "assistant", content: WELCOME_MESSAGES[1] },
          ]);
          setQuickReplies(["Brand new site", "Replacing an existing one"]);
        }, 1200);
      }, 300);

      // Refocus textarea after layout animation settles
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }, 400);
  }

  // Send to AI
  async function sendToAI(allMessages: ChatMessage[]) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
            ...(m.attachments
              ? { attachments: m.attachments.map((a) => ({ name: a.name, type: a.type })) }
              : {}),
          })),
          // Bot protection
          _hp: honeypot,
          _t: mountedAt.current,
          // _cf: turnstileToken, // Cloudflare Turnstile — enable later
        }),
      });

      if (!res.ok) throw new Error("AI service error");
      const data = await res.json();
      const rawContent = (data.message || "").replace("[COMPLETE]", "").trim();
      const { text: aiContent, replies } = parseQuickReplies(rawContent);

      // Split on "---" for multi-bubble responses
      const bubbles = aiContent.split(/\n---\n/).map((b) => b.trim()).filter(Boolean);

      playMessageSound();
      const now = Date.now();
      const newMessages: ChatMessage[] = bubbles.map((text, i) => ({
        id: `ai-${now}-${i}`,
        role: "assistant" as const,
        content: text,
      }));

      // First bubble appears immediately, rest stagger in
      setMessages((prev) => [...prev, newMessages[0]]);
      for (let i = 1; i < newMessages.length; i++) {
        await new Promise((r) => setTimeout(r, 800));
        playMessageSound();
        setMessages((prev) => [...prev, newMessages[i]]);
      }

      setQuickReplies(replies);

      if (data.isComplete) {
        setIsComplete(true);
        const finalMessages = [...allMessages, ...newMessages];
        submitConversation(finalMessages);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, something went wrong on my end. Could you try sending that again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Submit completed conversation to backend
  async function submitConversation(allMessages: ChatMessage[]) {
    // Collect all uploaded file paths from the conversation
    const uploadedFiles = allMessages
      .flatMap((m) => m.attachments || [])
      .filter((a) => a.storage_path)
      .map((a) => ({ name: a.name, type: a.type, size: a.size, storage_path: a.storage_path! }));

    try {
      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
            ...(m.attachments
              ? { attachments: m.attachments.map((a) => ({ name: a.name, type: a.type })) }
              : {}),
          })),
          uploaded_files: uploadedFiles,
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        console.error("Submit failed:", res.status, errBody);
      } else {
        const result = await res.json();
        console.log("Submission saved:", result);
      }
    } catch (err) {
      console.error("Failed to submit conversation:", err);
    }
  }

  // Send message
  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    if (isLoading || isComplete) return;

    // Rate limit check — if near the limit, let the AI know to wrap up
    if (userMessageCount >= MAX_USER_MESSAGES) {
      return; // Hard stop — shouldn't happen because we disable input
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setAttachedFiles([]);
    setQuickReplies([]);
    adjustHeight(true);
    await sendToAI(updatedMessages);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isChat) {
        handleActivate();
      } else {
        handleSend();
      }
    }
  }

  // Quick reply click
  async function handleQuickReply(reply: string) {
    if (isLoading || isComplete) return;
    setQuickReplies([]);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: reply,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await sendToAI(updatedMessages);
  }

  // File handling — uploads to Supabase Storage
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const attached: AttachedFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploading: true,
      };

      // Add preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setAttachedFiles((prev) =>
            prev.map((f) => (f.name === file.name && f.size === file.size && f.uploading ? { ...f, preview: ev.target?.result as string } : f)),
          );
        };
        reader.readAsDataURL(file);
      }

      // Add file immediately with uploading state
      setAttachedFiles((prev) => [...prev, attached]);

      // Upload to Supabase Storage
      const formData = new FormData();
      formData.append("file", file);

      fetch("/api/intake/upload", { method: "POST", body: formData })
        .then((res) => {
          if (!res.ok) throw new Error("Upload failed");
          return res.json();
        })
        .then((data) => {
          setAttachedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name && f.size === file.size && f.uploading
                ? { ...f, uploading: false, storage_path: data.storage_path }
                : f,
            ),
          );
        })
        .catch(() => {
          setAttachedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name && f.size === file.size && f.uploading
                ? { ...f, uploading: false, error: true }
                : f,
            ),
          );
        });
    });
    e.target.value = "";
  }

  function removeFile(index: number) {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const MAX_CHARS = 2000;
  const filesUploading = attachedFiles.some((f) => f.uploading);
  const hasContent = input.trim() !== "" || (attachedFiles.length > 0 && !filesUploading);
  const overCharLimit = input.length > MAX_CHARS;
  const inputDisabled = isLoading || isComplete || userMessageCount >= MAX_USER_MESSAGES;

  // ============================================================
  // COMPLETE SCREEN (standalone only)
  // ============================================================
  if (isComplete) {
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-surface-base px-4 min-h-screen">
        <GradientOrb className="-top-64 -right-64" color="rgba(242, 86, 35, 0.06)" size="800px" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex max-w-md flex-col items-center text-center"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
          >
            Thank you!
          </h2>
          <p className="text-text-secondary leading-relaxed mb-2">
            We've got everything we need. Our team is on it and you'll receive a visual mockup of your website within 2-3 days.
          </p>
          <p className="text-sm text-text-muted mt-1">
            This won't be the final product yet, but a design preview so you can see the direction and share feedback before we build it out.
          </p>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // SHARED INPUT BOX
  // ============================================================
  const inputBox = (
    <motion.div
      layoutId="prompt-box"
      className={cn(
        "relative rounded-3xl border bg-surface-floating",
        "shadow-[0_8px_30px_rgba(0,0,0,0.15)]",
        "focus-within:border-brand/40 focus-within:shadow-[0_0_0_1px_rgba(242,86,35,0.15),0_0_20px_rgba(242,86,35,0.1)]",
        "transition-[border-color,box-shadow] duration-200",
        isTransitioning
          ? "border-brand/30 shadow-[0_8px_40px_rgba(242,86,35,0.12)]"
          : "border-surface-border",
      )}
      transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
    >
      {/* File previews */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {attachedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-floating px-2.5 py-1.5"
            >
              {file.uploading ? (
                <Loader2Icon className="h-3.5 w-3.5 text-brand animate-spin" />
              ) : file.error ? (
                <XIcon className="h-3.5 w-3.5 text-red-400" />
              ) : file.preview ? (
                <img src={file.preview} alt={file.name} className="h-6 w-6 rounded object-cover" />
              ) : file.type.startsWith("image/") ? (
                <ImageIcon className="h-3.5 w-3.5 text-text-muted" />
              ) : (
                <FileTextIcon className="h-3.5 w-3.5 text-text-muted" />
              )}
              <span className={cn("text-xs truncate max-w-[100px]", file.error ? "text-red-400" : "text-text-secondary")}>{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea with typewriter placeholder */}
      <div className="relative">
        {!isChat && !input && (
          <div className="pointer-events-none absolute inset-0 flex items-center px-5 py-4">
            <span className="text-sm text-text-muted">
              {typewriterText}
              <span className="inline-block w-[2px] h-[14px] bg-text-muted/60 ml-[1px] align-middle animate-pulse" />
            </span>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustHeight();
          }}
          onFocus={!isChat ? handleActivate : undefined}
          onKeyDown={handleKeyDown}
          placeholder={isChat ? "Type your answer..." : ""}
          disabled={inputDisabled}
          rows={1}
          className={cn(
            "w-full resize-none border-none bg-transparent px-5 py-4 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
            "[&]:outline-none",
            "min-h-[44px]",
            "disabled:opacity-50",
          )}
          style={{ overflow: "hidden", outline: "none" }}
        />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={inputDisabled}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "text-text-muted transition-colors duration-200",
              "hover:bg-surface-elevated hover:text-text-secondary",
              "focus-visible:outline-2 focus-visible:outline-brand",
              "active:scale-[0.95]",
              "disabled:opacity-40",
            )}
          >
            <Paperclip className="h-4 w-4" />
          </button>
          {speechSupported && (
            <button
              type="button"
              onClick={toggleSpeech}
              disabled={inputDisabled}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                "transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-brand",
                "active:scale-[0.95]",
                "disabled:opacity-40",
                isListening
                  ? "bg-brand/15 text-brand hover:bg-brand/25"
                  : "text-[#777] hover:bg-[#2a2a2a] hover:text-[#bbb]",
              )}
              title={isListening ? "Stop recording" : "Voice input"}
            >
              <MicIcon className="h-4 w-4" />
            </button>
          )}
          {isChat && input.length > MAX_CHARS * 0.8 && (
            <span className={cn("text-[11px] tabular-nums", overCharLimit ? "text-red-400" : "text-text-muted")}>
              {input.length}/{MAX_CHARS}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => (isChat ? handleSend() : handleActivate())}
          disabled={isChat ? (isLoading || !hasContent || inputDisabled || overCharLimit) : false}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            "transition-all duration-200",
            "focus-visible:outline-2 focus-visible:outline-brand",
            "active:scale-[0.9]",
            isChat && hasContent
              ? "bg-text-primary text-surface-base hover:opacity-80"
              : "bg-surface-elevated text-text-muted",
            "disabled:opacity-40",
          )}
        >
          {isLoading ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUpIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.div>
  );

  // ============================================================
  // EMBEDDED INLINE MODE
  // ============================================================
  if (embedded) {
    // Complete state (inline)
    if (isComplete) {
      return (
        <section className="py-32 px-6">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-text-primary mb-3">
                Thank you!
              </h2>
              <p className="text-text-secondary leading-relaxed mb-2">
                We have got everything we need. Our team is on it and you will receive a visual mockup of your website within 2-3 days.
              </p>
              <p className="text-sm text-text-muted mt-1">
                This is not the final product yet, but a design preview so you can see the direction and share feedback before we build it out.
              </p>
            </motion.div>
          </div>
        </section>
      );
    }

    // Intro state (inline heading + input)
    if (!isChat) {
      return (
        <section id="get-started" className="py-32 px-6">
          <div className="max-w-xl mx-auto">
            <AnimatePresence>
              {!isTransitioning && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                  className="text-center mb-8"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium">
                    Free preview
                  </span>
                  <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mt-4 mb-5">
                    See your website <span className="text-brand">for free</span>.
                    <br />
                    <span className="text-text-secondary">Before you pay a thing.</span>
                  </h2>
                  <p className="text-text-secondary max-w-lg mx-auto">
                    Tell us about your business and we will create a free mockup of
                    your website within 1-3 days. No commitment, no payment info needed.
                    Love it? We build and launch it as your subscription starts.
                    <br />
                    <span className="text-sm text-text-muted">
                      No sign-up required. Takes about 2 minutes.
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {inputBox}

            {/* Honeypot */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="website_url_embed">Website</label>
              <input
                id="website_url_embed"
                name="website_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <AnimatePresence>
              {!isTransitioning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 flex items-center justify-center gap-6 text-text-muted"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>~2 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>Upload logos & files</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                    <span>No sign-up needed</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      );
    }

    // Chat state (inline card with internal scroll, fullscreen on mobile)
    return (
      <section id="get-started" className="py-10 sm:py-20 px-0 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="sm:rounded-2xl border-y sm:border border-surface-border bg-surface-elevated/60 backdrop-blur-sm overflow-hidden"
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-surface-border px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  if (messages.length <= 1 || window.confirm("Leave the conversation? Your progress will be lost.")) {
                    setIsChat(false);
                    setMessages([]);
                    setInput("");
                    setAttachedFiles([]);
                    setIsComplete(false);
                  }
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                  "text-text-muted transition-colors duration-200",
                  "hover:bg-surface-floating hover:text-text-primary",
                  "focus-visible:outline-2 focus-visible:outline-brand",
                  "active:scale-[0.95]",
                )}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <div className="relative">
                <AgentAvatar size="md" />
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-surface-elevated" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary font-[family-name:var(--font-plus-jakarta)]">
                  Lisa
                </p>
                <p className="text-[11px] text-text-muted">AI Assistant · ~2 min</p>
              </div>
            </div>

            {/* Messages (scrollable) */}
            <div
              ref={scrollRef}
              className="overflow-y-auto px-4 py-5 sm:px-5"
              style={{ height: "min(60vh, 520px)" }}
            >
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
                      className={cn(
                        "flex gap-2.5",
                        msg.role === "user" ? "justify-end" : "justify-start items-end",
                      )}
                    >
                      {msg.role === "assistant" && <AgentAvatar />}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          msg.role === "assistant"
                            ? "bg-surface-floating border border-surface-border text-text-primary"
                            : "bg-brand text-white",
                        )}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.attachments.map((file, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px]",
                                  msg.role === "user"
                                    ? "bg-white/15 text-white/80"
                                    : "bg-surface-elevated text-text-secondary",
                                )}
                              >
                                {file.type.startsWith("image/") ? (
                                  <ImageIcon className="h-3 w-3 shrink-0" />
                                ) : (
                                  <FileTextIcon className="h-3 w-3 shrink-0" />
                                )}
                                <span className="truncate max-w-[120px]">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-2.5 items-end">
                      <AgentAvatar />
                      <div className="rounded-2xl bg-surface-floating border border-surface-border px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
                          </div>
                          <span className="text-xs text-text-muted">typing</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick reply chips */}
                {quickReplies.length > 0 && !isLoading && !isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                    className="flex flex-wrap gap-2 pl-10"
                  >
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => handleQuickReply(reply)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm",
                          "border-surface-border bg-surface-floating text-text-secondary",
                          "hover:border-brand/50 hover:bg-brand/10 hover:text-text-primary",
                          "active:scale-[0.97]",
                          "transition-all duration-150",
                        )}
                      >
                        {reply}
                      </button>
                    ))}
                    <span className="self-center text-[11px] text-text-muted ml-1">or type your own</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Input pinned at bottom of card */}
            <div className="border-t border-surface-border px-4 pb-4 pt-3">
              {inputBox}
              <p className="mt-2 text-center text-[11px] text-text-muted">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ============================================================
  // INTRO SCREEN (standalone only)
  // ============================================================
  if (!isChat) {
    return (
      <div className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-surface-base px-4",
        embedded ? "min-h-[70vh] py-20" : "min-h-screen",
      )}>
        {!embedded && (
          <>
            <GradientOrb className="-top-64 -right-64" color="rgba(242, 86, 35, 0.06)" size="800px" />
            <GradientOrb className="-bottom-32 -left-48" color="rgba(242, 86, 35, 0.04)" size="600px" />
          </>
        )}

        <AnimatePresence>
          {!isTransitioning && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 mb-6 flex flex-col items-center text-center"
            >
              {embedded && (
                <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium mb-6">
                  Get started
                </span>
              )}
              <h1
                className={cn(
                  "font-bold tracking-tight text-text-primary mb-3",
                  embedded
                    ? "text-3xl sm:text-4xl md:text-5xl tracking-[-0.03em]"
                    : "text-3xl sm:text-4xl",
                )}
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
              >
                {embedded ? (
                  <>
                    See your website <span className="text-brand">for free</span>.
                    <br />
                    <span className="text-text-secondary">Before you pay a thing.</span>
                  </>
                ) : (
                  <>See your website <span className="text-brand">for free</span>.</>
                )}
              </h1>
              <p className={cn(
                "leading-relaxed text-[15px]",
                embedded ? "text-text-secondary max-w-lg" : "text-text-secondary max-w-md",
              )}>
                Tell us about your business and we will create a free mockup of
                your website within 1-3 days. No commitment, no payment info needed.
                Love it? We build and launch it as your subscription starts.
                <br />
                <span className={cn("text-sm", embedded ? "text-text-muted" : "text-text-muted")}>
                  No sign-up required. Takes about 2 minutes.
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-xl">
          {inputBox}

          {/* Honeypot — invisible to real users, bots fill it */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
            <label htmlFor="website_url">Website</label>
            <input
              id="website_url"
              name="website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {!isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center justify-center gap-6 text-text-muted"
              >
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>~2 min</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>Upload logos & files</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>No sign-up needed</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ============================================================
  // CHAT SCREEN
  // ============================================================
  return (
    <div className={cn(
      "relative flex flex-col overflow-hidden bg-surface-base",
      embedded ? "h-[80vh]" : "h-dvh",
    )}>
      {!embedded && <GradientOrb className="-top-64 -right-64" color="rgba(242, 86, 35, 0.04)" size="600px" />}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center gap-3 border-b border-surface-border px-4 py-3 sm:px-6"
      >
        <button
          type="button"
          onClick={() => {
            if (messages.length <= 1 || window.confirm("Leave the conversation? Your progress will be lost.")) {
              setIsChat(false);
              setMessages([]);
              setInput("");
              setAttachedFiles([]);
              setIsComplete(false);
            }
          }}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full shrink-0",
            "text-text-muted transition-colors duration-200",
            "hover:bg-surface-floating hover:text-text-primary",
            "focus-visible:outline-2 focus-visible:outline-brand",
            "active:scale-[0.95]",
          )}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div className="relative">
          <AgentAvatar size="md" />
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-surface-base" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Lisa
          </p>
          <p className="text-[11px] text-text-muted">AI Assistant - ~2 min</p>
        </div>
      </motion.div>

      {/* Messages */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex gap-2.5",
                  msg.role === "user" ? "justify-end" : "justify-start items-end",
                )}
              >
                {msg.role === "assistant" && <AgentAvatar />}
                <div
                  className={cn(
                    "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3",
                    msg.role === "assistant"
                      ? "bg-surface-elevated border border-surface-border text-text-primary"
                      : "bg-brand text-white",
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.attachments.map((file, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px]",
                            msg.role === "user"
                              ? "bg-white/15 text-white/80"
                              : "bg-surface-floating text-text-secondary",
                          )}
                        >
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="h-3 w-3 shrink-0" />
                          ) : (
                            <FileTextIcon className="h-3 w-3 shrink-0" />
                          )}
                          <span className="truncate max-w-[120px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2.5 items-end">
                <AgentAvatar />
                <div className="rounded-2xl bg-surface-elevated border border-surface-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs text-text-muted">typing</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick reply chips */}
          {quickReplies.length > 0 && !isLoading && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-2 pl-10"
            >
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleQuickReply(reply)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm",
                    "border-surface-border bg-surface-floating text-text-secondary",
                    "hover:border-brand/50 hover:bg-brand/10 hover:text-text-primary",
                    "active:scale-[0.97]",
                    "transition-all duration-150",
                  )}
                >
                  {reply}
                </button>
              ))}
              <span className="self-center text-[11px] text-text-muted ml-1">or type your own</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input pinned to bottom */}
      <div className="relative z-10 px-4 pb-4 pt-2 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {inputBox}
          <p className="mt-2 text-center text-[11px] text-text-muted">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
