"use client";
import React from "react";
import styles from "./index.module.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "white" | "dark" | string;
  type?: "spinner" | "dots" | "pulse" | "bar";
  text?: string;
  className?: string;
  fullWidth?: boolean;
  textPosition?: "top" | "bottom" | "right" | "left";
  overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "primary",
  type = "spinner",
  text,
  className = "",
  fullWidth = false,
  textPosition = "bottom",
  overlay = false,
}) => {
  const getColorValue = (colorName: string): string => {
    switch (colorName) {
      case "primary":
        return "#1C4A2A";
      case "white":
        return "#FFFFFF";
      case "dark":
        return "#333333";
      default:
        return colorName;
    }
  };

  const colorValue = getColorValue(color);
  
  const renderLoader = () => {
    switch (type) {
      case "dots":
        return (
          <div className={`${styles.dots} ${styles[size]}`} aria-label="Loading">
            <div style={{ backgroundColor: colorValue }}></div>
            <div style={{ backgroundColor: colorValue }}></div>
            <div style={{ backgroundColor: colorValue }}></div>
          </div>
        );
      case "pulse":
        return (
          <div 
            className={`${styles.pulse} ${styles[size]}`}
            style={{ borderColor: colorValue }}
            aria-label="Loading"
          ></div>
        );
      case "bar":
        return (
          <div className={styles.barContainer} aria-label="Loading">
            <div 
              className={styles.bar}
              style={{ backgroundColor: colorValue }}
            ></div>
          </div>
        );
      case "spinner":
      default:
        return (
          <div 
            className={`${styles.spinner} ${styles[size]}`}
            style={{ borderTopColor: colorValue }}
            aria-label="Loading"
          ></div>
        );
    }
  };

  const containerClasses = [
    styles.loaderContainer,
    text ? styles.withText : "",
    styles[`text-${textPosition}`],
    fullWidth ? styles.fullWidth : "",
    overlay ? styles.overlay : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div 
      className={containerClasses}
      data-testid="loader"
      role="status"
    >
      {renderLoader()}
      {text && <p className={styles.loaderText} style={{ color: color === "white" ? "#FFFFFF" : "#666" }}>{text}</p>}
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

export default Loader;