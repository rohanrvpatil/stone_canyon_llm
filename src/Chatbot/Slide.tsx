import React from "react";
import { motion } from "framer-motion";

interface SlideProps {
  origin?: "left" | "right"; // Restrict origin to "left" or "right"
  className?: string; // Optional className prop
  children: React.ReactNode; // Children can be any React nodes
}

const Slide: React.FC<SlideProps> = ({
  origin = "left",
  className = "",
  children,
}) => {
  const initialX = origin === "left" ? "-100%" : "100%";
  const animateX = 0;

  return (
    <motion.div
      initial={{ x: initialX, opacity: 0.5 }}
      animate={{ x: animateX, opacity: 1 }}
      exit={{ x: initialX, opacity: 0.5 }}
      transition={{ duration: 0.4, ease: "backOut" }} //easeOut, easeInOut, circOut, backOut
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideLeft: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => (
  <Slide origin="left" className={className}>
    {children}
  </Slide>
);

export const SlideRight: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => (
  <Slide origin="right" className={className}>
    {children}
  </Slide>
);
