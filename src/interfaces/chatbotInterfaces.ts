export interface ChatbotState {
  chatbotOpen: boolean;
  currentNode: ChatbotNode | null;
}

export interface ChatbotNode {
  question: string;
  options: { [key: string]: ChatbotNode | string };
}

export interface ChatbotProps {
  categoryId: number;
}
