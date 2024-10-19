import React from "react";
// import { memo } from "react";

import styles from "./Chatbot.module.css";
import Markdown from "markdown-to-jsx";
import { SlideLeft, SlideRight } from "./Slide";

// interfaces
import { ChatHistoryProps } from "../interfaces";

const ChatHistory: React.FC<
  ChatHistoryProps & {
    handleOptionClick: (
      dispatch: any,
      currentNode: any,
      option: string,
      questionFunnel: string,
      userData: any
    ) => void;
    dispatch: any;
    currentNode: any;
    questionFunnel: string;
    userData: any;
  }
> = ({
  history,
  handleOptionClick,
  dispatch,
  currentNode,
  questionFunnel,
  userData,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {history.map((message) => {
        if (message.type === "options") {
          return (
            <SlideLeft key={message.id} className={styles.optionsContainer}>
              {Array.isArray(message.text) && // Check if text is an array
                message.text.map((option, idx) => (
                  <button
                    key={`${message.id}-option-${option}-${idx}`}
                    className={styles.option}
                    onClick={() =>
                      handleOptionClick(
                        dispatch,
                        currentNode,
                        option,
                        questionFunnel,
                        userData
                      )
                    }
                  >
                    {`${idx + 1}. `}
                    {option}
                  </button>
                ))}
            </SlideLeft>
          );
        } else if (message.type === "question") {
          return (
            <SlideLeft key={message.id} className={styles.questionContainer}>
              <Markdown className={styles.question}>
                {typeof message.text === "string" ? message.text : ""}
              </Markdown>
            </SlideLeft>
          );
        } else if (message.type === "answer") {
          return (
            <SlideRight key={message.id} className={styles.answerContainer}>
              <p className={styles.answer}>{message.text}</p>
            </SlideRight>
          );
        } else {
          return (
            <SlideLeft
              key={message.id}
              className={styles.validationErrorContainer}
            >
              <p className={styles.validationError}>{message.text}</p>
            </SlideLeft>
          );
        }
      })}
    </div>
  );
};
export default ChatHistory;
