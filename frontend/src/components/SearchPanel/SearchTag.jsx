import React from "react";
import { useDispatch } from "react-redux";
import { setTag } from "../../features/clientSlice";

const SearchTag = ({ icon, text, active, handleTagChange, changeTag }) => {
  const dispatch = useDispatch();
  return (
    <button
      className={`search-btn ${active ? "active" : ""}`}
      onClick={() => dispatch(setTag(text))}
    >
      <div className="tag_icon">{icon}</div>
      {text}
    </button>
  );
};

export default SearchTag;
