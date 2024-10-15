// general
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import Markdown from "markdown-to-jsx";

// components
import { toggleChatbot } from "./ChatbotUtils";
import {
  handleOptionClick,
  handleUserInput,
  handleKeyDown,
} from "./ChatbotInput";
import ChatHistory from "./ChatHistory";
import UserDataModal from "./UserDataModal";

// import { createChatbotTree } from "./ChatbotTree";

// styles
import styles from "./Chatbot.module.css";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setChatbotOpen, setCurrentInput } from "../store/chatbotSlice";
import { closeModal } from "../store/modalSlice";

// icons
import ForumSharpIcon from "@mui/icons-material/ForumSharp";
import SendIcon from "@mui/icons-material/Send";

// interfaces
import { ChatbotProps } from "../interfaces/chatbotInterfaces";

const Chatbot: React.FC<ChatbotProps> = ({ categoryId }) => {
  // state
  const dispatch = useDispatch();

  const chatbotOpen = useSelector(
    (state: RootState) => state.chatbot.chatbotOpen
  );
  const currentNode = useSelector(
    (state: RootState) => state.chatbot.currentNode
  );
  const questionFunnel = useSelector(
    (state: RootState) => state.chatbot.questionFunnel
  );
  const userData = useSelector((state: RootState) => state.user);
  const messages = useSelector((state: RootState) => state.chatbot.messages);
  const currentInput = useSelector(
    (state: RootState) => state.chatbot.currentInput
  );
  const currentInputIndex = useSelector(
    (state: RootState) => state.chatbot.currentInputIndex
  );
  const isOpen = useSelector((state: any) => state.modal.isOpen);
  const serviceId = useSelector((state: RootState) => state.user.serviceId);

  const [localInput, setLocalInput] = useState(currentInput);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // const chatbotTree = useSelector((state: RootState) => state.chatbot.tree);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <>
      <ToastContainer />
      {/*  Pops up if invalid categoryId is entered*/}
      <div
        className={styles.chatbotIcon}
        onClick={() =>
          toggleChatbot(
            dispatch,
            categoryId,
            chatbotOpen,
            // fetchCategoryTree,
            setChatbotOpen
          )
        }
      >
        <ForumSharpIcon fontSize="large" sx={{ color: "white" }} />
      </div>
      {chatbotOpen && (
        <div className={styles.chatbotWindow}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {isOpen ? (
              <UserDataModal
                dispatch={dispatch}
                isOpen={isOpen}
                userData={userData}
                onClose={closeModal}
              />
            ) : null}
          </div>
          <div className={styles.chatbotHeader}>
            <p style={{ marginLeft: "8px", fontWeight: "bold" }}>Chatbot</p>
          </div>
          <div className={styles.chatbotBody} ref={chatContainerRef}>
            <ChatHistory history={messages} />
            {currentNode && Object.keys(currentNode.options).length > 0 && (
              <>
                <div className={styles.questionContainer}>
                  <p className={styles.question}>{currentNode.question}</p>
                </div>

                <div className={styles.optionsContainer}>
                  {Object.keys(currentNode.options).map((option, index) => (
                    <button
                      key={option}
                      onClick={() =>
                        handleOptionClick(
                          dispatch,
                          currentNode,
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
                </div>
              </>
            )}
            {currentNode && Object.keys(currentNode.options).length === 0 && (
              <div className={styles.questionContainer}>
                <Markdown className={styles.question}>
                  {currentNode.question}
                </Markdown>
              </div>
            )}
          </div>

          <div className={styles.userInputContainer}>
            <input
              type="text"
              placeholder="Message..."
              className={styles.userInputField}
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value);
                dispatch(setCurrentInput(e.target.value));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleKeyDown(
                    dispatch,
                    userData,
                    currentInput,
                    currentInputIndex,
                    currentNode,
                    categoryId,
                    questionFunnel,
                    serviceId
                  )(event);
                  setLocalInput("");
                  dispatch(setCurrentInput(""));
                }
              }}
            />
            <div
              className={styles.userSendButton}
              onClick={() => {
                handleUserInput(
                  dispatch,
                  userData,
                  currentInput,
                  currentInputIndex,
                  currentNode,
                  categoryId,
                  questionFunnel,
                  serviceId
                );
                setLocalInput("");
                dispatch(setCurrentInput(""));
              }}
            >
              <SendIcon fontSize="medium" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
