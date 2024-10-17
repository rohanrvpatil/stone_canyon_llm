import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { sendMessageToChatbot } from "./LLM";

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY!;

// import { fetchCategoryTree } from "./ChatbotTree";

// type FetchCategoryTreeType = (dispatch: any, categoryId: number) => void;
type SetChatbotOpenType = (isOpen: boolean) => {
  type: string;
  payload: boolean;
};
import { ChatbotNode } from "../interfaces";
import { setCurrentNode } from "../store/chatbotSlice";

export const createChatbotNode = (question: string): ChatbotNode => ({
  question,
  options: {},
});

export const toggleChatbot = async (
  dispatch: any,
  categoryId: number,
  chatbotOpen: boolean,
  // fetchCategoryTree: FetchCategoryTreeType,
  setChatbotOpen: SetChatbotOpenType
) => {
  if (categoryId >= 1 && categoryId <= 7) {
    // fetchCategoryTree(dispatch, categoryId);
    // const botMessage = await sendMessageToChatbot(
    //   GEMINI_API_KEY,
    //   "You are a chatbot. Show a welcome message"
    // );
    const newNode = createChatbotNode(
      "Hello there! 👋 I'm happy to be here. What can I do for you today? 😊"
    );
    dispatch(setCurrentNode(newNode));
    dispatch(setChatbotOpen(!chatbotOpen));
  } else {
    toast.dismiss();
    toast.error(
      "Invalid Category ID entered. Please enter a value between 1 and 7.",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
      }
    );
  }
};
