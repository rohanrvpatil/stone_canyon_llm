// general
import React from "react";
import { ToastContainer } from "react-toastify";

// components
import { toggleChatbot } from "./ChatbotUtils";
// import { createChatbotTree } from "./ChatbotTree";

// styles
import styles from "./Chatbot.module.css";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setChatbotOpen } from "../store/chatbotSlice";

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
  // const chatbotTree = useSelector((state: RootState) => state.chatbot.tree);

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
          <div className={styles.chatbotHeader}>
            <p style={{ marginLeft: "8px", fontWeight: "bold" }}>Chatbot</p>
          </div>
          <div className={styles.chatbotBody}>
            {/* <ChatHistory history={messages} /> */}
            {currentNode && Object.keys(currentNode.options).length > 0 && (
              <>
                <div className={styles.questionContainer}>
                  <p className={styles.question}>{currentNode.question}</p>
                </div>

                <div className={styles.optionsContainer}>
                  {Object.keys(currentNode.options).map((option) => (
                    <button key={option} className={styles.option}>
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={styles.userInputContainer}>
            <input
              type="text"
              placeholder="Message..."
              className={styles.userInputField}
            />
            <div className={styles.userSendButton}>
              <SendIcon fontSize="medium" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
