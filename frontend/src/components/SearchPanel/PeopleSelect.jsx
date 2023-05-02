import React, { useState, useEffect } from "react";
import search4 from "../../assets/search/search4.svg";
import "./SearchPanel.scss";

const PeopleSelect = ({ agesArray, setAgesArray }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAgeChange = (index, value) => {
    const newAgesArray = [...agesArray];
    newAgesArray[index] = +value;
    setAgesArray(newAgesArray);
  };

  const handleAddAge = (isAdult) => {
    const newAgesArray = [...agesArray, isAdult ? 1000 : 1];
    setAgesArray(newAgesArray);
  };

  const handleRemoveAdult = () => {
    const idx = agesArray.indexOf(1000);
    if (idx !== -1) {
      const newAgesArray = [...agesArray];
      newAgesArray.splice(idx, 1);
      setAgesArray(newAgesArray);
    }
  };

  const handleDeleteAge = (index) => {
    const newAgesArray = [...agesArray];
    newAgesArray.splice(index, 1);
    setAgesArray(newAgesArray);
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
              <button className="count-btn" onClick={() => handleRemoveAdult()}>
                -
              </button>
              <input
                type="text"
                value={agesArray.filter((age) => age == 1000).length}
                readOnly
                className="count-box"
              />
              <button className="count-btn" onClick={() => handleAddAge(true)}>
                +
              </button>
            </div>
          </div>
          <div className="kids_box">
            <button onClick={() => handleAddAge()}>Добавить ребенка</button>
            {agesArray
              ?.filter((age) => age !== 1000)
              ?.map((age, idx) => {
                return (
                  <div className="kid_input" key={idx}>
                    Возр.{" "}
                    {/* <input
                      type="number"
                      value={age}
                      placeholder="12"
                      autoFocus
                      onChange={(e) => handleAgeChange(idx, e.target.value)}
                    /> */}
                    <select
                      name=""
                      id=""
                      value={age}
                      className="primary-input"
                      onChange={(e) => handleAgeChange(idx, e.target.value)}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
                      <option value={11}>11</option>
                      <option value={12}>12</option>
                      <option value={13}>13</option>
                      <option value={14}>14</option>
                      <option value={15}>15</option>
                      <option value={16}>16</option>
                      <option value={17}>17</option>
                    </select>
                    <button onClick={() => handleDeleteAge(idx)}>X</button>
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PeopleSelect;
