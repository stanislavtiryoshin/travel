import React from "react";

const SearchTag = ({ icon, text, active, handleTagChange }) => {
  return (
    <button
      className={`search-btn ${active ? "active" : ""}`}
      onClick={() => handleTagChange(text)}
    >
      <img src={icon} alt="" className="tag_icon" />
      {text}
    </button>
  );
};

export default SearchTag;
