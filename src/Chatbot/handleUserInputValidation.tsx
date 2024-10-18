import { Dispatch } from "redux";
import {
  addMessage,
  setCurrentInputIndex,
  setCurrentNode,
} from "../store/chatbotSlice";
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateZipCode,
  validateFullAddress,
} from "./userInputValidation";
import { ChatbotNode } from "../interfaces/chatbotInterfaces";
import { createChatbotNode } from "./ChatbotInput";
import userDataQuestions from "../../backend/data/userDataQuestions.json";
import { openModal } from "../store/modalSlice";

// const batchAddMessages = (dispatch: any, messages: any[]) => {
//   messages.forEach((message) => {
//     dispatch(message);
//   });
// };

const handleUserInputValidation = (
  dispatch: Dispatch,
  currentInput: string,
  currentNode: ChatbotNode | null,
  currentQuestionKey: string,
  currentInputIndex: number
) => {
  let errorMessage: string | null = null;

  // Validate input based on the current question
  switch (currentQuestionKey) {
    case "fullName":
      errorMessage = validateFullName(currentInput);
      break;
    case "emailAddress":
      errorMessage = validateEmail(currentInput);
      break;
    case "phoneNumber":
      errorMessage = validatePhone(currentInput);
      break;
    case "zipCode":
      errorMessage = validateZipCode(currentInput);
      break;
    case "fullAddress":
      errorMessage = validateFullAddress(currentInput);
      break;
    default:
      break;
  }

  // Dispatch the question message
  dispatch(
    addMessage({
      id: `question-${Date.now()}`,
      text: currentNode!.question,
      isUser: false,
      type: "question",
    })
  );
  dispatch(
    addMessage({
      id: `user-${Date.now()}`,
      text: currentInput,
      isUser: true,
      type: "answer",
    })
  );

  // If there's an error message, dispatch it
  if (errorMessage) {
    dispatch(
      addMessage({
        id: `error-${Date.now()}`,
        text: errorMessage,
        isUser: false,
        type: "error",
      })
    );

    return; // Exit the function if there's an error
  }

  if (currentInputIndex < userDataQuestions.length - 1) {
    const newIndex = currentInputIndex + 1;
    dispatch(setCurrentInputIndex(newIndex));
    const nextNode = createChatbotNode(
      userDataQuestions[currentInputIndex + 1].question
    );
    dispatch(setCurrentNode(nextNode));
  } else {
    dispatch(setCurrentNode(null));
    dispatch(openModal());
  }
};

export default handleUserInputValidation;
