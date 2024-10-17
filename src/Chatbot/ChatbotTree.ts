import axios from "axios";

import { ChatbotNode } from "../interfaces/chatbotInterfaces";
import { setCurrentNode } from "../store/chatbotSlice";

export const buildChatbotTreeFromArray = (
  data: any[],
  categoryId: number
): ChatbotNode => {
  const chatbotTree: ChatbotNode = {
    question: "",
    options: {},
  };

  data.forEach((row) => {
    if (parseInt(row["Category ID"], 10) === categoryId) {
      const funnel = row["Question Funnel"].split(" | ");
      let currentNode: ChatbotNode = chatbotTree;

      funnel.forEach((pair: string) => {
        const [question, option] = pair.split(" > ");

        if (!currentNode.question) {
          currentNode.question = question;
        }

        if (!currentNode.options[option]) {
          currentNode.options[option] = { question: "", options: {} };
        }

        currentNode = currentNode.options[option] as ChatbotNode;
      });
    }
  });

  return chatbotTree;
};

export const fetchCategoryTree = (dispatch: any, categoryId: number) => {
  axios
    .get(`http://localhost:5000/fetch-category-data?categoryId=${categoryId}`)
    .then((response) => {
      const categoryData = response.data;
      // console.log(categoryData);
      const chatbotTree = buildChatbotTreeFromArray(categoryData, categoryId);
      // console.log(chatbotTree);
      dispatch(setCurrentNode(chatbotTree));
    })
    .catch((error) => console.error("Error fetching categories:", error));
};
