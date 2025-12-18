import React from "react";
import CardSkeleton from "./CardSkeleton";

const HomeSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  );
};

export default HomeSkeleton;
