// general
import { KeyboardEvent } from "react";

// interfaces
import { ChatbotNode } from "../interfaces/chatbotInterfaces";
import { UserData } from "../interfaces/userInterfaces";

// redux
import {
  addMessage,
  setCurrentNode,
  setQuestionFunnel,
  setCurrentInputIndex,
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
import { updateServiceId, fetchUserDataQuestions } from "./ChatbotAPI";
import { fetchCategoryTree } from "./ChatbotTree";

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
      fetchUserDataQuestions(dispatch);
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
      const serviceId = await updateServiceId(
        questionFunnel + newQuestionFunnel
      );
      console.log(`Service ID: ${serviceId}`);

      const updatedUserData: UserData = {
        ...userData,
        serviceId: serviceId,
      };

      dispatch(setUserData(updatedUserData));
    }

    // console.log("Updated Question Funnel:", questionFunnel + newQuestionFunnel);
  }
};

import { openModal } from "../store/modalSlice";
import { sendMessageToChatbot } from "./LLM";

export const handleUserInput = async (
  dispatch: any,
  userData: UserData,
  currentInput: string,
  currentInputIndex: number,
  currentNode: ChatbotNode | null,
  categoryId: number,
  questionFunnel: string,
  serviceId: number
) => {
  // state

  const currentQuestionKey = userDataQuestions[currentInputIndex]?.key;
  if (currentNode && serviceId) {
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
  }

  let newNode = createChatbotNode("Preparing response...");
  dispatch(setCurrentNode(newNode));

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY!;

  if (currentInput.toLowerCase().includes("help")) {
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

    let botMessage = await sendMessageToChatbot(
      GEMINI_API_KEY,
      currentInput +
        "Agree to help and say that you will ask a few questions to you to know about their problem. Keep it short because" +
        " I have automated code to handle the next part of the conversation"
    );
    newNode = createChatbotNode(botMessage);
    dispatch(setCurrentNode(newNode));

    dispatch(
      addMessage({
        id: `question-${Date.now()}`,
        text: botMessage,
        isUser: false,
        type: "question",
      })
    );

    fetchCategoryTree(dispatch, categoryId);
    return;
  }

  const digitMatch = currentInput.replace(/\D/g, "");

  if (digitMatch.length === 1 && currentNode) {
    const selectedIndex = parseInt(digitMatch, 10) - 1;
    const optionKeys = Object.keys(currentNode.options);

    if (selectedIndex >= 0 && selectedIndex < optionKeys.length) {
      const selectedOptionText = optionKeys[selectedIndex];
      console.log(`Selected Option Text: ${selectedOptionText}`);

      handleOptionClick(
        dispatch,
        currentNode,
        selectedOptionText,
        questionFunnel,
        userData
      );
      return;
    }
  }

  const updatedUserData: UserData = {
    ...userData,
    [currentQuestionKey]: currentInput,
  };

  dispatch(setUserData(updatedUserData));

  if (currentInputIndex < userDataQuestions.length - 1) {
    const newIndex = currentInputIndex + 1;
    dispatch(setCurrentInputIndex(newIndex));
    const nextNode = createChatbotNode(
      userDataQuestions[currentInputIndex + 1].question
    );
    dispatch(setCurrentNode(nextNode));
  } else {
    console.log(userData);
    dispatch(setCurrentNode(null));
    dispatch(openModal());
  }
};

export const handleKeyDown = (
  dispatch: any,
  userData: UserData,
  currentInput: string,
  currentInputIndex: number,
  currentNode: ChatbotNode | null,
  categoryId: number,
  questionFunnel: string,
  serviceId: number
) => {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
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
    }
  };
};
