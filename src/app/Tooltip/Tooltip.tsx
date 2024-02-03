import React, { useState, useEffect } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  const stylesVisible = `${styles.tooltip} ${styles.visible}`;
  const stylesHidden = `${styles.tooltip} ${styles.visible}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={isVisible ? stylesVisible : stylesHidden}>{message}</div>
  );
};

export default Tooltip;
