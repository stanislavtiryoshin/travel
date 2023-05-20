import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setSearchData } from "../../features/search/searchSlice";
import search3 from "../../assets/search/search3.svg";
import { useDispatch, useSelector } from "react-redux";

const DateSelect = () => {
  const dispatch = useDispatch();

  const { searchData } = useSelector((state) => state.search);

  // Date picker function
  const [startingDate, setStartingDate] = useState(new Date(+searchData.start));
  const [endingDate, setEndingDate] = useState(new Date(1685642400000));

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartingDate(start);
    setEndingDate(end);
    if (start && end) {
      dispatch(
        setSearchData({
          ...searchData,
          start: Date.parse(start),
          daysAmount:
            (Date.parse(end) - Date.parse(start)) / 1000 / 60 / 60 / 24 + 1,
        })
      );
    }
  };

  return (
    <div className="search_col">
      <img src={search3} alt="" className="search_bot-icon" />
      <div className="search_col-content">
        <div className="search_col-top">Когда?</div>
        <div className="search_col-bot">
          <DatePicker
            dateFormat="dd.MM"
            onChange={onChange}
            startDate={startingDate}
            endDate={endingDate}
            selectsRange
            selected={startingDate}
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelect;
