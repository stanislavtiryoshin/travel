import React from "react";

const EmptyHolder = ({ text }) => {
  return (
    <div className="placeholder">
      <div className="placeholder_text">{text}</div>
    </div>
  );
};

export default EmptyHolder;
