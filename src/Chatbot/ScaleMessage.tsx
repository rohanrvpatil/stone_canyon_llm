import React, { ReactNode, useMemo } from "react"; // Import ReactNode
import { motion } from "framer-motion";

interface ScaleMessageProps {
  origin?: "top-left" | "top-right";
  className?: string;
  children: ReactNode;
}

const ScaleMessage: React.FC<ScaleMessageProps> = ({
  origin = "top-left",
  className,
  children,
}) => {
  const transformOrigin = origin === "top-left" ? "top left" : "top right";

  // Calculate the text length from children if it's a string
  const textLength = useMemo(() => {
    // Check if children is a string or contains a string as content
    if (typeof children === "string") {
      return children.length;
    } else if (React.isValidElement(children)) {
      return children.props.children.length || 0; // Support for nested elements with text inside
    }
    return 0;
  }, [children]);

  // Set duration based on text length
  const duration = textLength > 40 ? 0.4 : 0.2;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{
        duration, // Control the duration based on text length
        ease: [0.42, 0, 0.58, 1], // Custom cubic-bezier easing for smooth scaling
      }}
      style={{ transformOrigin }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScaleMessage;
