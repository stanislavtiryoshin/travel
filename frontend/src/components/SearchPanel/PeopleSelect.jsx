import React, { useState, useEffect } from "react";
import search4 from "../../assets/search/search4.svg";
import "./SearchPanel.scss";

const PeopleSelect = ({
  handlePeopleSelect,
  handleKidsSelect,
  handleAdultSelect,
  kids,
  adults,
  kidsArr,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderKidInputs = (kids) => {
    let kidsArray = [];
    for (let i = 0; i < kids; i++) {
      kidsArray.push(
        <div className="kid_input" key={i}>
          Возр. {"     "}
          <input type="number" value={10} />
        </div>
      );
    }
    return <div className="kids_inputs-box">{kidsArray}</div>;
  };

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
                onClick={() => handleAdultSelect(-1)}
              >
                -
              </button>
              <input type="text" value={adults} className="count-box" />
              <button
                className="count-btn"
                onClick={() => handleAdultSelect(+1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="kids_box">
            <button onClick={() => handleKidsSelect()}>Добавить ребенка</button>
            {renderKidInputs(kids)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PeopleSelect;
