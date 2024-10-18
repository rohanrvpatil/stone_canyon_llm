// ChatbotBody.tsx
// import { memo } from "react";
import React from "react";
import Markdown from "markdown-to-jsx";
import styles from "./Chatbot.module.css"; // Adjust this path if necessary
import { ChatbotNode, UserData } from "../interfaces";
import ScaleMessage from "./ScaleMessage";
export interface ChatbotBodyProps {
  dispatch: any;
  memoizedCurrentNode: ChatbotNode | null;
  handleOptionClick: (
    dispatch: any,
    currentNode: ChatbotNode | null,
    option: string,
    questionFunnel: string,
    userData: UserData
  ) => void; //void indicates that function does not return anything
  questionFunnel: string;
  userData: UserData;
}

const ChatbotBody: React.FC<ChatbotBodyProps> = React.memo(
  ({
    dispatch,
    memoizedCurrentNode,
    handleOptionClick,
    questionFunnel,
    userData,
  }) => (
    <>
      {memoizedCurrentNode &&
        Object.keys(memoizedCurrentNode.options).length > 0 && (
          <>
            <ScaleMessage
              origin="top-left"
              className={styles.questionContainer}
            >
              <p className={styles.question}>{memoizedCurrentNode.question}</p>
            </ScaleMessage>
            <ScaleMessage origin="top-left" className={styles.optionsContainer}>
              {Object.keys(memoizedCurrentNode.options).map((option, index) => (
                <button
                  key={option}
                  onClick={() =>
                    handleOptionClick(
                      dispatch,
                      memoizedCurrentNode,
                      option,
                      questionFunnel,
                      userData
                    )
                  }
                  className={styles.option}
                >
                  {`${index + 1}. `}
                  {option}
                </button>
              ))}
            </ScaleMessage>
          </>
        )}
      {memoizedCurrentNode &&
        Object.keys(memoizedCurrentNode.options).length === 0 && (
          <ScaleMessage origin="top-left" className={styles.questionContainer}>
            <Markdown className={styles.question}>
              {memoizedCurrentNode.question}
            </Markdown>
          </ScaleMessage>
        )}
    </>
  )
);

export default ChatbotBody;
