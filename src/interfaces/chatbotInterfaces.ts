export interface QuestionNode {
  question: string;
  answer: string;
  children: QuestionNode[];
}

export interface ChatbotState {
  chatbotOpen: boolean;
  tree: QuestionNode[];
}

export interface ChatbotProps {
  categoryId: number;
}
