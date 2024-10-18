// general
// import { KeyboardEvent } from "react";

// interfaces
import { ChatbotNode } from "../interfaces/chatbotInterfaces";
import { UserData } from "../interfaces/userInterfaces";
// import { useCallback, useMemo } from "react";

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
import { sendMessageToChatbot } from "./LLM";

// helper functions
export const createChatbotNode = (question: string): ChatbotNode => ({
  question,
  options: {},
});

// const batchAddMessages = (dispatch: any, messages: any[]) => {
//   messages.forEach((message) => {
//     dispatch(addMessage(message));
//   });
// };

export const handleOptionClick = async (
  dispatch: any,
  currentNode: ChatbotNode | null,
  option: string,
  questionFunnel: string,
  userData: UserData
) => {
  if (currentNode && currentNode.options[option]) {
    const nextNode = currentNode.options[option] as ChatbotNode;

    // dispatch(
    //   addMessage({
    //     id: `question-${Date.now()}`,
    //     text: currentNode.question,
    //     isUser: false,
    //     type: "question",
    //   })
    // );

    // dispatch(
    //   addMessage({
    //     id: `options-${Date.now()}`,
    //     text: Object.keys(currentNode.options),
    //     isUser: false,
    //     type: "options",
    //   })
    // );
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
      dispatch(setCurrentNode(null));
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

  // when user has already answered all questions in the question funnel
  const currentQuestionKey = userDataQuestions[currentInputIndex]?.key;
  if (currentNode && serviceId) {
    handleUserInputValidation(
      dispatch,
      currentInput,
      currentQuestionKey,
      currentInputIndex
    );
  }
  // when user enters anything which includes "help"
  if (currentInput.toLowerCase().includes("help")) {
    // let newNode = createChatbotNode("Preparing response...");
    // dispatch(setCurrentNode(newNode));

    await handleWordHelp({
      dispatch,
      currentInput,
      categoryId,
      GEMINI_API_KEY,
    });
  }

  // when user enters option number
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

  // when user enters option text
  if (currentNode && Object.keys(currentNode.options).length > 0) {
    const optionKeys = Object.keys(currentNode.options);

    const prompt = `Given the options: "${optionKeys.join(
      '", "'
    )}", what is the closest match to this input: "${currentInput}"?.
    If you think there's a match return the option text which matches the user input.
    If you think there's no close match, then just return "No match"`;

    try {
      const closestMatch = await sendMessageToChatbot(GEMINI_API_KEY, prompt);
      const cleanedClosestMatch = closestMatch?.replace(/\s+/g, "") ?? "";

      // console.log(`Cleaned Closest Match: ${cleanedClosestMatch}`);
      if (cleanedClosestMatch != "Nomatch") {
        const matchedOption = optionKeys.find(
          (option) =>
            option.replace(/\s+/g, "").toLowerCase() ===
            cleanedClosestMatch.toLowerCase()
        );

        // console.log(`Matched option: ${matchedOption}`);
        if (matchedOption) {
          // console.log(`Matched Option Text: ${matchedOption}`);

          handleOptionClick(
            dispatch,
            currentNode,
            matchedOption,
            questionFunnel,
            userData
          );
          return;
        }
      } else {
        // dispatch(
        //   addMessage({
        //     id: `question-${Date.now()}`,
        //     text: currentNode!.question,
        //     isUser: false,
        //     type: "question",
        //   })
        // );
        // dispatch(
        //   addMessage({
        //     id: `options-${Date.now()}`,
        //     text: Object.keys(currentNode.options),
        //     isUser: false,
        //     type: "options",
        //   })
        // );
        dispatch(
          addMessage({
            id: `error-${Date.now()}`,
            text: "No option is closely matching your input. Please try again",
            isUser: false,
            type: "error",
          })
        );

        // return;
      }
    } catch (error) {
      console.error("Error finding the closest match:", error);
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
