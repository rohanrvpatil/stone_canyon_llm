import { Dispatch } from "redux";
import { addMessage, setCurrentNode } from "../store/chatbotSlice";
import { sendMessageToChatbot } from "./LLM";
import { fetchCategoryTree } from "./ChatbotTree";
import { ChatbotNode } from "../interfaces/chatbotInterfaces";

export const createChatbotNode = (question: string): ChatbotNode => ({
  question,
  options: {},
});

interface HandleUserInputParams {
  dispatch: Dispatch;
  currentInput: string;
  categoryId: number;
  GEMINI_API_KEY: string;
}

const handleWordHelp = async ({
  dispatch,
  currentInput,
  categoryId,
  GEMINI_API_KEY,
}: HandleUserInputParams) => {
  dispatch(
    addMessage({
      id: `user-${Date.now()}`,
      text: currentInput,
      isUser: true,
      type: "answer",
    })
  );

  let botMessage = await sendMessageToChatbot(
    GEMINI_API_KEY,
    currentInput +
      " Agree to help and say that you will ask a few questions to know about their problem. Keep it short because I have automated code to handle the next part of the conversation."
  );

  const newNode = createChatbotNode(botMessage);
  dispatch(setCurrentNode(newNode));

  fetchCategoryTree(dispatch, categoryId);
};

export default handleWordHelp;
