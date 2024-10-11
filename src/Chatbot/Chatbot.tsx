// general
import axios from "axios";
import React, { useEffect } from "react";
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
  // const chatbotTree = useSelector((state: RootState) => state.chatbot.tree);

  useEffect(() => {
    axios
      .get("http://localhost:5000/fetch-category-data")
      .then((response) => {
        const tree = response.data;
        console.log(tree);
        // const transformedTree: QuestionNode[] = tree.map((category) => ({
        //   question: category.categoryName,
        //   answer: "",
        //   children: category.questions.map((q) => ({
        //     question: q.question,
        //     answer: q.answer,
        //     children: [],
        //   })),
        // }));
        // console.log(transformedTree);
        // dispatch(setChatbotTree(transformedTree));
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, [dispatch]);

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
