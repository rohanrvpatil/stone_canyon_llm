// general
// import { KeyboardEvent } from "react";

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
import handleUserInputValidation from "./handleUserInputValidation";
import handleWordHelp from "./handleWordHelp";

import { updateServiceId, fetchUserDataQuestions } from "./ChatbotAPI";

// helper functions
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
      const serviceId = await updateServiceId(
        questionFunnel + newQuestionFunnel
      );

      const updatedUserData: UserData = {
        ...userData,
        serviceId: serviceId,
      };

      dispatch(setUserData(updatedUserData));
    } else {
      newQuestionFunnel += " | ";
    }
    dispatch(setQuestionFunnel(questionFunnel + newQuestionFunnel));
  }
};

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
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY!;

  const currentQuestionKey = userDataQuestions[currentInputIndex]?.key;
  if (currentNode && serviceId) {
    handleUserInputValidation(
      dispatch,
      currentInput,
      currentNode,
      currentQuestionKey,
      currentInputIndex
    );
  }

  if (currentInput.toLowerCase().includes("help")) {
    let newNode = createChatbotNode("Preparing response...");
    dispatch(setCurrentNode(newNode));

    await handleWordHelp({
      dispatch,
      currentInput,
      currentNode,
      categoryId,
      GEMINI_API_KEY,
    });
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
  if (currentInput.trim() !== "") {
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
