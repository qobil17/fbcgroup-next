import { useEffect, useRef, useState, KeyboardEvent } from "react";

const WS_URL =
  (process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3007") + "/chatbot";

interface ChatMsg {
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Connect WebSocket when widget opens; reset conversation on every new open
  useEffect(() => {
    if (!open) return;

    // Clear any messages from a previous session so the welcome never duplicates
    setMessages([]);
    setTyping(false);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data as string);

        if (data.event === "typing") {
          setTyping(true);
          return;
        }

        setTyping(false);

        if (data.event === "bot") {
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: data.text, timestamp: data.timestamp },
          ]);
        }
        // "user" echo events are ignored — we add them optimistically on send
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
      setTyping(false);
    };
  }, [open]);

  // Scroll to bottom on new messages or typing indicator
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      return;

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", text, timestamp: new Date().toISOString() },
    ]);
    setInput("");
    wsRef.current.send(JSON.stringify({ event: "message", data: text }));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6l-2 2V4h16v10z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header__info">
              <div className={`chatbot-header__dot ${connected ? "online" : ""}`} />
              <span className="chatbot-header__title">FBC GROUP Assistant</span>
            </div>
            <button
              className="chatbot-header__close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 && !typing && (
              <p className="chatbot-messages__empty">
                Savolingizni yozing, yordam beramiz! 🤝
              </p>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-bubble chatbot-bubble--${msg.role}`}>
                {msg.role === "bot" && (
                  <div className="chatbot-bubble__avatar">🤖</div>
                )}
                <div className="chatbot-bubble__body">
                  <p className="chatbot-bubble__text">{msg.text}</p>
                  <span className="chatbot-bubble__time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="chatbot-bubble chatbot-bubble--bot">
                <div className="chatbot-bubble__avatar">🤖</div>
                <div className="chatbot-bubble__body chatbot-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="chatbot-input-row">
            <input
              ref={inputRef}
              className="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Xabar yozing..."
              disabled={!connected}
              maxLength={500}
            />
            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={!input.trim() || !connected}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
