import React from "react";

const SearchTag = ({ icon, text, active, handleTagChange }) => {
  return (
    <button
      className={`search-btn ${active ? "active" : ""}`}
      onClick={() => handleTagChange(text)}
    >
      <div className="tag_icon">{icon}</div>
      {text}
    </button>
  );
};

export default SearchTag;
