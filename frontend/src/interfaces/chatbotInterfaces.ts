export interface ChatbotState {
  chatbotOpen: boolean;
  currentNode: ChatbotNode | null;
  questionFunnel: string;
  messages: ChatMessage[];
  currentInput: string;
  currentInputIndex: number;
  chatbotTree: ChatbotNode | null;
  isInitialized: boolean;
}

export interface ChatbotNode {
  question: string;
  options: { [key: string]: ChatbotNode | string };
}

export interface ChatbotProps {
  categoryId: number;
}

export interface ChatMessage {
  id: string;
  type: "question" | "answer" | "options" | "error";
  text: string | string[]; // Can be a string or an array of options
  isUser: boolean;
}

export interface ChatHistoryProps {
  history: ChatMessage[]; // Array of chat messages
}
