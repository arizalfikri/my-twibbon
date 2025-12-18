import React from "react";
import CardSkeleton from "./CardSkeleton";
import UserCardSkeleton from "./UserCardSkeleton";

const ExploreSkeleton = ({ type = "twibbon" }) => {
  if (type === "creator") {
    return (
      <>
        {[...Array(8)].map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {[...Array(10)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  );
};

export default ExploreSkeleton;
