import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interfaces
import {
  ChatbotState,
  ChatbotNode,
  ChatMessage,
} from "../interfaces/chatbotInterfaces";

const initialState: ChatbotState = {
  currentNode: null,
  chatbotOpen: false,
  questionFunnel: "",
  messages: [],
  currentInput: "",
  currentInputIndex: 0,
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    setChatbotOpen(state, action: PayloadAction<boolean>) {
      state.chatbotOpen = action.payload;
    },
    setCurrentNode(state, action: PayloadAction<ChatbotNode | null>) {
      state.currentNode = action.payload;
    },
    setQuestionFunnel: (state, action: PayloadAction<string>) => {
      state.questionFunnel = action.payload; // Update validation message state
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setCurrentInput: (state, action: PayloadAction<string>) => {
      state.currentInput = action.payload;
    },
  },
});

export const {
  setChatbotOpen,
  setCurrentNode,
  setQuestionFunnel,
  addMessage,
  setCurrentInput,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
