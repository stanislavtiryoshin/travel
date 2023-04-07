import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchTag from "./SearchTag";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setStartDate,
  setEndDate,
  setDaysAmount,
  setPeopleAmount,
  setDestination,
} from "../../features/clientSlice";

import { getCamps } from "../../features/camps/campSlice";

import "./SearchPanel.scss";

import line from "../../assets/hero/line.svg";

import search1 from "../../assets/search/search1.svg";
import search2 from "../../assets/search/search2.svg";
import search3 from "../../assets/search/search3.svg";
import { getSearchedHotels, reset } from "../../features/hotel/hotelSlice";

import { tags } from "./tags";
import PeopleSelect from "./PeopleSelect";

const SearchPanel = ({ isUserLook, style }) => {
  const dispatch = useDispatch();

  const [panelTag, setPanelTag] = useState("Отели");

  const [allLocations, setAllLocations] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/locations`)
      .then((response) => {
        setAllLocations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [startingDate, setStartingDate] = useState(
    localStorage.getItem("startDate") !== "NaN"
      ? new Date(+JSON.parse(localStorage.getItem("startDate")))
      : new Date()
  );
  const [endingDate, setEndingDate] = useState(
    localStorage.getItem("endDate") !== "NaN"
      ? new Date(+JSON.parse(localStorage.getItem("endDate")))
      : new Date(Date.now() + 3600 * 1000 * 24)
  );
  const [searchTerms, setSearchTerms] = useState({
    tag: "Туры",
    origin: "Астана",
    destination: allLocations?._id ? allLocations[0]._id : null,
    number: 1,
  });

  const [clientData, setClientData] = useState({
    endDate: Date.parse(endingDate),
    startDate: Date.parse(startingDate),
    peopleAmount: 1,
    daysAmount: localStorage.getItem("daysAmount")
      ? JSON.parse(localStorage.getItem("daysAmount"))
      : 2,
    destination: "",
  });

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartingDate(start);
    setEndingDate(end);
    if (start && end) {
      setClientData({
        ...clientData,
        startDate: Date.parse(start),
        endDate: Date.parse(end),
        daysAmount:
          (Date.parse(end) - Date.parse(start)) / 1000 / 60 / 60 / 24 + 1,
      });

      dispatch(setStartDate(Date.parse(start)));
      dispatch(setEndDate(Date.parse(end)));
      dispatch(
        setDaysAmount(
          (Date.parse(end) - Date.parse(start)) / 1000 / 60 / 60 / 24 + 1
        )
      );
    }
  };

  useEffect(() => {
    setClientData({
      ...clientData,
      startDate: localStorage.getItem("startDate"),
      endDate: localStorage.getItem("endDate"),
      peopleAmount: localStorage.getItem("peopleAmount"),
      daysAmount: localStorage.getItem("daysAmount"),
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("startDate", clientData.startDate);
    localStorage.setItem("endDate", clientData.endDate);
    localStorage.setItem("daysAmount", clientData.daysAmount);
    localStorage.setItem("peopleAmount", clientData.peopleAmount);
  }, [clientData]);

  const handleTagChange = (text) => {
    setPanelTag(text);
    setSearchTerms({ ...searchTerms, tag: text });
  };

  const handleSearch = ({
    locationId,
    peopleAmount,
    daysAmount,
    startDate,
  }) => {
    if (panelTag === "Отели") {
      dispatch(
        getSearchedHotels({ locationId, peopleAmount, daysAmount, startDate })
      );
    }
    if (panelTag === "Лагеря") {
      dispatch(getCamps());
    }
  };

  const handlePeopleSelect = (num) => {
    setSearchTerms({ ...searchTerms, number: e.target.value });
    // changeAmount(e.target.value);
    setClientData({
      ...clientData,
      peopleAmount: e.target.value,
    });
    dispatch(setPeopleAmount(e.target.value));
  };

  return (
    <div className="search_box" style={style && { ...style }}>
      {!isUserLook && (
        <div className="search_top">
          {tags.map((tag, id) => {
            const isActive = panelTag === tag.text;
            return (
              <SearchTag
                key={id}
                icon={tag.icon}
                text={tag.text}
                active={isActive}
                handleTagChange={handleTagChange}
              />
            );
          })}
        </div>
      )}

      <div className="search_bot">
        <div className="search_col">
          <img src={search1} alt="" className="search_bot-icon" />
          <div className="search_col-content">
            <div className="search_col-top">Откуда?</div>
            <div className="search_col-bot">
              <input
                type="text"
                placeholder="Астана"
                name="origin"
                value={searchTerms.origin}
                onChange={(e) => {
                  setSearchTerms({ ...searchTerms, origin: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <img src={line} className="line" alt="" />
        <div className="search_col">
          <img src={search2} alt="" className="search_bot-icon" />
          <div className="search_col-content">
            <div className="search_col-top">Куда?</div>
            <div className="search_col-bot">
              <select
                type="text"
                placeholder="Астана"
                name="destination"
                value={searchTerms.destination}
                onChange={(e) => {
                  setSearchTerms({
                    ...searchTerms,
                    destination: e.target.value,
                  });
                  dispatch(setDestination(e.target.value));
                }}
              >
                <option value="Весь" selected>
                  Весь Казахстан
                </option>
                {allLocations ? (
                  allLocations.map((location, idx) => {
                    return (
                      <option value={location._id} key={idx}>
                        {location.locationName}
                      </option>
                    );
                  })
                ) : (
                  <p>Locations are loading</p>
                )}
              </select>
            </div>
          </div>
        </div>
        <img src={line} className="line" alt="" />
        <div className="search_col">
          <img src={search3} alt="" className="search_bot-icon" />
          <div className="search_col-content">
            <div className="search_col-top">Когда?</div>
            <div className="search_col-bot">
              <DatePicker
                dateFormat="dd/MM/yy"
                selected={startingDate}
                onChange={onChange}
                startDate={startingDate}
                endDate={endingDate}
                selectsRange
              />
            </div>
          </div>
        </div>
        <img src={line} className="line" alt="" />
        <PeopleSelect
          handlePeopleSelect={handlePeopleSelect}
          value={searchTerms.number}
        />
        <button
          className="primary-btn yellow"
          onClick={() => {
            if (searchTerms.destination && searchTerms.destination !== "Весь") {
              handleSearch({
                locationId: searchTerms.destination,
                peopleAmount: clientData.peopleAmount,
                daysAmount: clientData.daysAmount,
                startDate: clientData.startDate,
              });
            } else if (searchTerms.destination === "Весь") {
              handleSearch({
                locationId: "",
                peopleAmount: clientData.peopleAmount,
                daysAmount: clientData.daysAmount,
                startDate: clientData.startDate,
              });
            }
          }}
        >
          Найти
        </button>
      </div>
    </div>
  );
};

export default SearchPanel;
