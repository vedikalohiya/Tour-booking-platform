import { useState } from "react";

import {
  chatWithBedrock,
  fetchPackages
} from "../api/apiClient";

function Chatbot() {

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const send = async () => {

    if (!msg.trim()) return;

    const userMessage = msg;

    // SHOW USER MESSAGE
    setChat((prev) => [
      ...prev,
      {
        text: userMessage,
        type: "user"
      }
    ]);

    setMsg("");

    setLoading(true);

    try {

      // ALL CHATBOT INTERACTIONS GO THROUGH BEDROCK AGENT
      const response = await chatWithBedrock(
        userMessage,
        sessionId
      );

      console.log("FULL CHATBOT RESPONSE:", response);

      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      const botText =
        response.reply ||
        response.response ||
        "No response from chatbot";

      // SHOW BOT MESSAGE
      setChat((prev) => [
        ...prev,
        {
          text: botText,
          type: "bot"
        }
      ]);

    } catch (error) {

      console.error("CHATBOT ERROR:", error);

      setChat((prev) => [
        ...prev,
        {
          text: "⚠️ Chatbot server error. Please try again.",
          type: "bot"
        }
      ]);
    }

    setLoading(false);
  };

  return (

    <div className="chatbot-container">

      {/* CHAT ICON */}
      {!open && (
        <div
          className="chat-icon"
          onClick={() => setOpen(true)}
        >
          💬
        </div>
      )}

      {/* CHAT WINDOW */}
      {open && (

        <div className="chat-window">

          {/* HEADER */}
          <div className="chat-header">

            GT Assistant

            <span
              className="close-btn"
              onClick={() => {
                setOpen(false);
                setSessionId(null);
                setChat([]);
              }}
            >
              ✖
            </span>

          </div>

          {/* CHAT BODY */}
          <div className="chat-body">

            {chat.map((c, i) => (

              <div
                key={i}
                className={c.type}
              >
                {c.text}
              </div>

            ))}

            {/* LOADING */}
            {loading && (
              <div className="bot">
                Typing...
              </div>
            )}

          </div>

          {/* INPUT */}
          <div className="chat-input">

            <input
              placeholder="Ask about packages..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  send();
                }
              }}
            />

            <button onClick={send}>
              Send
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Chatbot;