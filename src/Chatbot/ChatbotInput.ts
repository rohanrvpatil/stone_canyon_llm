// interfaces
import { ChatbotNode } from "../interfaces/chatbotInterfaces";
import { UserData } from "../interfaces/userInterfaces";

// redux
import {
  addMessage,
  setCurrentNode,
  setQuestionFunnel,
} from "../store/chatbotSlice";
import { setUserData } from "../store/userSlice";

// components
import userDataQuestions from "../../backend/data/userDataQuestions.json";
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateZipCode,
  validateFullAddress,
} from "./userInputValidation";
import { updateServiceId } from "./ChatbotAPI";

export const createChatbotNode = (question: string): ChatbotNode => ({
  question,
  options: {},
});

export const handleOptionClick = async (
  dispatch: any,
  currentNode: ChatbotNode | null,
  option: string,
  questionFunnel: string,
  userData: UserData
) => {
  if (currentNode && currentNode.options[option]) {
    const nextNode = currentNode.options[option] as ChatbotNode;

    dispatch(
      addMessage({
        id: `question-${Date.now()}`,
        text: currentNode.question,
        isUser: false,
        type: "question",
      })
    );

    dispatch(
      addMessage({
        id: `options-${Date.now()}`,
        text: Object.keys(currentNode.options),
        isUser: false,
        type: "options",
      })
    );

    dispatch(
      addMessage({
        id: `user-${Date.now()}`,
        text: option,
        isUser: true,
        type: "answer",
      })
    );

    dispatch(setCurrentNode(nextNode));

    let newQuestionFunnel = currentNode.question + " > " + option;

    if (
      !nextNode ||
      !nextNode.options ||
      Object.keys(nextNode.options).length === 0
    ) {
      // fetchUserDataQuestions(dispatch);
    } else {
      newQuestionFunnel += " | ";
    }
    dispatch(setQuestionFunnel(questionFunnel + newQuestionFunnel));

    if (
      !nextNode ||
      !nextNode.options ||
      Object.keys(nextNode.options).length === 0
    ) {
      console.log(questionFunnel + newQuestionFunnel);
      const response = await updateServiceId(
        questionFunnel + newQuestionFunnel
      );
      const { serviceId } = response;

      const updatedUserData: UserData = {
        ...userData,
        serviceId: serviceId,
      };

      dispatch(setUserData(updatedUserData));
    }

    // console.log("Updated Question Funnel:", questionFunnel + newQuestionFunnel);
  }
};

import { sendMessageToChatbot } from "./LLM";

export const handleUserInput = async (
  dispatch: any,
  userData: UserData,
  currentInput: string,
  currentInputIndex: number,
  currentNode: ChatbotNode | null
) => {
  // state

  let newNode = createChatbotNode("Typing...");
  dispatch(setCurrentNode(newNode));

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

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY!;

  let botMessage = await sendMessageToChatbot(GEMINI_API_KEY, currentInput);
  newNode = createChatbotNode(botMessage);

  dispatch(setCurrentNode(newNode));

  return;

  const currentQuestionKey = userDataQuestions[currentInputIndex]?.key;

  if (currentNode) {
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

    dispatch(
      addMessage({
        id: `question-${Date.now()}`,
        text: currentNode.question,
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

    if (errorMessage) {
      dispatch(
        addMessage({
          id: `error-${Date.now()}`,
          text: errorMessage,
          isUser: false,
          type: "error",
        })
      );

      return;
    }

    const updatedUserData: UserData = {
      ...userData,
      [currentQuestionKey]: currentInput,
    };

    dispatch(setUserData(updatedUserData));

    // if (currentInputIndex < userDataQuestions.length - 1) {
    //   const newIndex = currentInputIndex + 1;
    //   dispatch(setCurrentInputIndex(newIndex));
    //   const nextNode = createChatbotNode(
    //     userDataQuestions[currentInputIndex + 1].question
    //   );
    //   dispatch(setCurrentNode(nextNode));
    // } else {
    //   console.log(userData);
    //   dispatch(setCurrentNode(null));
    //   dispatch(openModal());
    // }
  }
};
