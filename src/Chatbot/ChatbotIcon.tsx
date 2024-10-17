// ChatbotIcon.tsx
import ForumSharpIcon from "@mui/icons-material/ForumSharp";
import styles from "./Chatbot.module.css";

type SetChatbotOpenType = (isOpen: boolean) => {
  type: string;
  payload: boolean;
};

interface ChatbotIconProps {
  toggleChatbot: (
    dispatch: any,
    categoryId: number,
    chatbotOpen: boolean,
    setChatbotOpen: SetChatbotOpenType
  ) => void;
  dispatch: any;
  categoryId: number;
  chatbotOpen: boolean;
  setChatbotOpen: SetChatbotOpenType;
}

const ChatbotIcon: React.FC<ChatbotIconProps> = ({
  toggleChatbot,
  dispatch,
  categoryId,
  chatbotOpen,
  setChatbotOpen,
}) => (
  <div
    className={styles.chatbotIcon}
    onClick={() =>
      toggleChatbot(dispatch, categoryId, chatbotOpen, setChatbotOpen)
    }
  >
    <ForumSharpIcon fontSize="large" sx={{ color: "white" }} />
  </div>
);

export default ChatbotIcon;
