import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interfaces
import { ChatbotState, QuestionNode } from "../interfaces/chatbotInterfaces";

const initialState: ChatbotState = {
  chatbotOpen: false,
  tree: [],
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    setChatbotOpen(state, action: PayloadAction<boolean>) {
      state.chatbotOpen = action.payload;
    },
    setChatbotTree: (state, action: PayloadAction<QuestionNode[]>) => {
      state.tree = action.payload;
    },
  },
});

export const { setChatbotOpen, setChatbotTree } = chatbotSlice.actions;

export default chatbotSlice.reducer;
