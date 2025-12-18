import React from "react";

const Skeleton = ({
  className = "",
  variant = "rectangular",
  width,
  height,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    rectangular: "rounded-md",
    circular: "rounded-full",
    text: "rounded h-4 w-full mb-2",
  };

  const style = {
    width: width || (variant === "text" ? undefined : "100%"),
    height: height || (variant === "text" ? undefined : "100%"),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
