import React from "react";

const SearchTag = ({ icon, text, active, handleTagChange, changeTag }) => {
  return (
    <button
      className={`search-btn ${active ? "active" : ""}`}
      onClick={() => changeTag(text)}
    >
      <div className="tag_icon">{icon}</div>
      {text}
    </button>
  );
};

export default SearchTag;
