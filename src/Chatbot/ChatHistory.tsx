import React from "react";
// import { memo } from "react";

import styles from "./Chatbot.module.css";
import Markdown from "markdown-to-jsx";
import ScaleMessage from "./ScaleMessage";

// interfaces
import { ChatHistoryProps } from "../interfaces";

const ChatHistory: React.FC<ChatHistoryProps> = React.memo(({ history }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {history.map((message) => {
        if (message.type === "options") {
          return (
            <div key={message.id} className={styles.optionsContainer}>
              {Array.isArray(message.text) && // Check if text is an array
                message.text.map((option, idx) => (
                  <button
                    key={`${message.id}-option-${option}-${idx}`}
                    className={styles.option}
                  >
                    {`${idx + 1}. `}
                    {option}
                  </button>
                ))}
            </div>
          );
        } else if (message.type === "question") {
          return (
            <ScaleMessage
              key={message.id}
              origin="top-left"
              className={styles.questionContainer}
            >
              <Markdown className={styles.question}>
                {typeof message.text === "string" ? message.text : ""}
              </Markdown>
            </ScaleMessage>
          );
        } else if (message.type === "answer") {
          return (
            <ScaleMessage
              key={message.id}
              origin="top-right"
              className={styles.answerContainer}
            >
              <p className={styles.answer}>{message.text}</p>
            </ScaleMessage>
          );
        } else {
          return (
            <div key={message.id} className={styles.validationErrorContainer}>
              <p className={styles.validationError}>{message.text}</p>
            </div>
          );
        }
      })}
    </div>
  );
});
export default ChatHistory;
