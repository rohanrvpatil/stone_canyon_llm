export const parseQuestionFunnel = (questionFunnel: string) => {
  return questionFunnel.split("|").map((pair) => {
    const [question, answer] = pair.split(">");
    return { question: question.trim(), answer: answer.trim(), children: [] };
  });
};

export const createChatbotTree = (data: any[]) => {
  return data.map((item) => ({
    categoryID: item.CategoryID,
    categoryName: item.CategoryName,
    serviceID: item.ServiceID,
    questions: parseQuestionFunnel(item.QuestionFunnel),
  }));
};
