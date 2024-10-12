import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interfaces
import { ChatbotState, ChatbotNode } from "../interfaces/chatbotInterfaces";

const initialState: ChatbotState = {
  currentNode: null,
  chatbotOpen: false,
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
  },
});

export const { setChatbotOpen, setCurrentNode } = chatbotSlice.actions;

export default chatbotSlice.reducer;
