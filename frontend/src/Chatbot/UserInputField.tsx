import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Assuming Redux is set up
import SendIcon from "@mui/icons-material/Send"; // Assuming SendIcon is from Material UI or replace with your icon
import { setCurrentInput } from "../store/chatbotSlice"; // Assuming you have this action
import styles from "./Chatbot.module.css"; // Update the path if needed
import { RootState } from "../store";
import { handleUserInput, handleKeyDown } from "./ChatbotInput";

interface UserInputFieldProps {
  categoryId: number;
}

const UserInputField: React.FC<UserInputFieldProps> = ({ categoryId }) => {
  const dispatch = useDispatch();

  // Access Redux state directly
  const userData = useSelector((state: RootState) => state.user);
  const currentInput = useSelector(
    (state: RootState) => state.chatbot.currentInput
  );
  const currentInputIndex = useSelector(
    (state: RootState) => state.chatbot.currentInputIndex
  );
  const currentNode = useSelector(
    (state: RootState) => state.chatbot.currentNode
  );

  const questionFunnel = useSelector(
    (state: RootState) => state.chatbot.questionFunnel
  );
  const serviceId = useSelector((state: RootState) => state.user.serviceId);

  const [localInput, setLocalInput] = useState(currentInput);

  const handleUserInputExtended = () => {
    handleUserInput(
      dispatch,
      userData,
      currentInput,
      currentInputIndex,
      currentNode,
      categoryId,
      questionFunnel,
      serviceId
    );

    setLocalInput("");
    dispatch(setCurrentInput(""));
  };

  const handleKeyDownExtended = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      console.log(`handleKeyDownExtended is executed`);
      handleKeyDown(
        dispatch,
        userData,
        currentInput,
        currentInputIndex,
        currentNode,
        categoryId,
        questionFunnel,
        serviceId
      );

      // Reset input field
      setLocalInput("");
      dispatch(setCurrentInput(""));
    }
  };

  return (
    <div className={styles.userInputContainer}>
      <input
        type="text"
        placeholder="Message..."
        className={styles.userInputField}
        value={localInput}
        onChange={(e) => {
          setLocalInput(e.target.value);
          dispatch(setCurrentInput(e.target.value));
        }}
        onKeyDown={handleKeyDownExtended}
      />
      <div className={styles.userSendButton} onClick={handleUserInputExtended}>
        <SendIcon fontSize="medium" />
      </div>
    </div>
  );
};

export default UserInputField;
