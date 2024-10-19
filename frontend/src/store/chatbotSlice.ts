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
  chatbotTree: null,
  isInitialized: false,
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
      const newMessage = action.payload;

      return {
        ...state,
        messages: state.messages.concat(newMessage),
      };
    },

    setCurrentInput: (state, action: PayloadAction<string>) => {
      state.currentInput = action.payload;
    },
    setChatbotTree(state, action: PayloadAction<ChatbotNode | null>) {
      state.chatbotTree = action.payload;
    },
    setCurrentInputIndex(state, action: PayloadAction<number>) {
      state.currentInputIndex = action.payload;
    },
    setIsInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },
});

export const {
  setChatbotOpen,
  setCurrentNode,
  setQuestionFunnel,
  addMessage,
  setCurrentInput,
  setChatbotTree,
  setCurrentInputIndex,
  setIsInitialized,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
