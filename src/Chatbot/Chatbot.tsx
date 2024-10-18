// general
import React, { useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// components
import { toggleChatbot } from "./ChatbotUtils";
import { handleOptionClick } from "./ChatbotInput";
import UserDataModal from "./UserDataModal";
import UserInputField from "./UserInputField";
// import { createChatbotTree } from "./ChatbotTree";

// styles
import styles from "./Chatbot.module.css";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setChatbotOpen, addMessage } from "../store/chatbotSlice";
import { closeModal } from "../store/modalSlice";

// interfaces
import { ChatbotProps } from "../interfaces/chatbotInterfaces";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotIcon from "./ChatbotIcon";
// import ChatbotBody from "./ChatbotBody";
import ChatHistory from "./ChatHistory";

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
  const isOpen = useSelector((state: any) => state.modal.isOpen);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const memoizedCurrentNode = useMemo(() => currentNode, [currentNode]);
  const memoizedHistory = useMemo(() => messages, [messages]); //un-memoize messages to try and make it work

  // const chatbotTree = useSelector((state: RootState) => state.chatbot.tree);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currentNode) {
      dispatch(
        addMessage({
          id: `question-${Date.now()}`,
          text: currentNode.question,
          isUser: false,
          type: "question",
        })
      );

      if (currentNode.options && Object.keys(currentNode.options).length > 0) {
        dispatch(
          addMessage({
            id: `options-${Date.now()}`,
            text: Object.keys(currentNode.options),
            isUser: false,
            type: "options",
          })
        );
      }
    }
  }, [currentNode, dispatch]); // Runs whenever the currentNode changes

  return (
    <>
      <ToastContainer />{" "}
      {/*  Pops up if invalid categoryId is entered in CategoryIdInput component*/}
      <ChatbotIcon
        toggleChatbot={toggleChatbot}
        dispatch={dispatch}
        categoryId={categoryId}
        chatbotOpen={chatbotOpen}
        setChatbotOpen={setChatbotOpen}
      />
      <AnimatePresence>
        {chatbotOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.17, ease: "easeInOut" }}
            style={{ transformOrigin: "bottom right" }}
            className={styles.chatbotWindow}
          >
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
            <ChatbotHeader />
            <div className={styles.chatbotBody} ref={chatContainerRef}>
              <ChatHistory history={memoizedHistory} />

              {/* <ChatbotBody
                dispatch={dispatch}
                memoizedCurrentNode={memoizedCurrentNode}
                handleOptionClick={handleOptionClick}
                questionFunnel={questionFunnel}
                userData={userData}
              /> */}
            </div>
            <UserInputField categoryId={categoryId} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
