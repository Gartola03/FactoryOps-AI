import { useState } from "react";
import type { FormEvent } from "react";
import "./Copilot.css";

type ChatMessage = {
  id: number;
  text: string;
};

function Copilot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessages((current) => [...current, { id: Date.now(), text }]);
    setMessage("");
  }

  return (
    <div className="copilot-page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">AI workspace</p>
          <h1>AI Copilot</h1>
          <p className="page-subtitle">Write a message to prepare a future maintenance conversation.</p>
        </div>
        <span className="copilot-status">LLM not connected</span>
      </div>

      <section className="copilot-chat" aria-label="AI Copilot chat">
        <div className="copilot-messages">
          {messages.length === 0 ? (
            <p className="copilot-empty">Your messages will appear here.</p>
          ) : messages.map((item) => (
            <div className="copilot-message" key={item.id}>{item.text}</div>
          ))}
        </div>
        <form className="copilot-composer" onSubmit={handleSubmit}>
          <label htmlFor="copilot-message">Message</label>
          <div className="copilot-compose-row">
            <input
              id="copilot-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write a message..."
              autoComplete="off"
            />
            <button type="submit">Send</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Copilot;
