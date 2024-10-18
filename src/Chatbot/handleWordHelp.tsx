import { Dispatch } from "redux";
import { addMessage, setCurrentNode } from "../store/chatbotSlice"; // Update the path as needed
import { sendMessageToChatbot } from "./LLM"; // Update the path to your API utility
import { fetchCategoryTree } from "./ChatbotTree"; // Update the path to your chatbot node creation logic
import { ChatbotNode } from "../interfaces/chatbotInterfaces";

export const createChatbotNode = (question: string): ChatbotNode => ({
  question,
  options: {},
});
// Define the type for the parameters
interface HandleUserInputParams {
  dispatch: Dispatch;
  currentInput: string;
  categoryId: number; // Adjust type as needed
  GEMINI_API_KEY: string; // Add type for API key
}

// const batchAddMessages = (dispatch: any, messages: any[]) => {
//   messages.forEach((message) => {
//     dispatch(message);
//   });
// };

// Create a function to handle user input
const handleWordHelp = async ({
  dispatch,
  currentInput,
  // currentNode,
  categoryId,
  GEMINI_API_KEY,
}: HandleUserInputParams) => {
  // Dispatch the user's question
  // dispatch(
  //   addMessage({
  //     id: `question-${Date.now()}`,
  //     text: currentNode!.question,
  //     isUser: false,
  //     type: "question",
  //   })
  // );
  dispatch(
    addMessage({
      id: `user-${Date.now()}`,
      text: currentInput,
      isUser: true,
      type: "answer",
    })
  );

  // Send the input to the chatbot
  let botMessage = await sendMessageToChatbot(
    GEMINI_API_KEY,
    currentInput +
      " Agree to help and say that you will ask a few questions to know about their problem. Keep it short because I have automated code to handle the next part of the conversation."
  );

  // Create a new chatbot node from the bot's response
  const newNode = createChatbotNode(botMessage);
  dispatch(setCurrentNode(newNode));

  // Dispatch the bot's question
  // dispatch(
  //   addMessage({
  //     id: `question-${Date.now()}`,
  //     text: botMessage,
  //     isUser: false,
  //     type: "question",
  //   })
  // );

  // Fetch the category tree
  fetchCategoryTree(dispatch, categoryId);
};

export default handleWordHelp;
