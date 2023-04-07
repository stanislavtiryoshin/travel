import React, { useState, useEffect } from "react";
import search4 from "../../assets/search/search4.svg";
import "./SearchPanel.scss";

const PeopleSelect = ({ handlePeopleSelect, value }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="search_col people_col">
      <img src={search4} alt="" className="search_bot-icon" />
      <div className="people_select-box">
        <button
          className="people-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Кто?
        </button>
      </div>
      {isExpanded ? (
        <div className="people-dropdown">
          <div className="people_title">Количество туристов</div>
          <div className="adults_row row">
            Взрослых
            <div className="count_btns-box">
              <button
                className="count-btn"
                onClick={() => setAdults(adults - 1)}
              >
                -
              </button>
              <input
                type="text"
                readOnly
                value={adults}
                className="count-box"
                onChange={handlePeopleSelect}
              />
              <button
                className="count-btn"
                onClick={() => setAdults(adults + 1)}
              >
                +
              </button>
            </div>
          </div>
          {/* <input
            type="number"
            placeholder="1"
            name="number"
            value={value}
            onChange={(e) => {
              handlePeopleSelect(e);
            }}
          /> */}
        </div>
      ) : null}
    </div>
  );
};

export default PeopleSelect;
