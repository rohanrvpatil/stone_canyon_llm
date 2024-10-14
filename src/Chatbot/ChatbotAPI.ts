import { ChatbotNode } from "../interfaces/chatbotInterfaces";

import { setCurrentNode, setChatbotTree } from "../store/chatbotSlice";

export const createChatbotNode = (question: string): ChatbotNode => ({
  question,
  options: {},
});

export const updateServiceId = async (questionFunnel: string) => {
  try {
    const response = await fetch("http://localhost:5000/update-service-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Question-Funnel": questionFunnel,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update service ID:", error);
    return null;
  }
};

export const fetchUserDataQuestions = (dispatch: any) => {
  fetch(`http://localhost:5000/user-data-questions`)
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        console.log("All questions have been answered");
      } else {
        // console.log(data);

        const userQuestionNode = createChatbotNode(data.question);

        dispatch(setChatbotTree(userQuestionNode));
        dispatch(setCurrentNode(userQuestionNode));
      }
    })
    .catch((error) => {
      console.error("Error fetching User data questions:", error);
    });
};
