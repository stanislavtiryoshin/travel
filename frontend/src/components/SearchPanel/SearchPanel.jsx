import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchTag from "./SearchTag";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  setStartDate,
  setEndDate,
  setDaysAmount,
  setPeopleAmount,
  setDestination,
} from "../../features/clientSlice";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import "./SearchPanel.scss";

import tag1 from "../../assets/tags/tag1.svg";
import tag2 from "../../assets/tags/tag2.svg";
import tag3 from "../../assets/tags/tag3.svg";
import tag4 from "../../assets/tags/tag4.svg";
import tag5 from "../../assets/tags/tag5.svg";

import search1 from "../../assets/search/search1.svg";
import search2 from "../../assets/search/search2.svg";
import search3 from "../../assets/search/search3.svg";
import search4 from "../../assets/search/search4.svg";
import { getSearchedHotels } from "../../features/hotel/hotelSlice";

const tags = [
  {
    icon: tag1,
    text: "Туры",
  },
  {
    icon: tag2,
    text: "1-3 дневные",
  },
  {
    icon: tag3,
    text: "Санатории",
  },
  {
    icon: tag4,
    text: "Лагеря",
  },
  {
    icon: tag5,
    text: "Отели",
  },
];

const SearchPanel = (
  {
    // changeAmount,
    // changeDaysAmount,
    // changeDate,
    // handleSearch,
  }
) => {
  const dispatch = useDispatch();

  const handleSearch = (location) => {
    dispatch(getSearchedHotels(location));
    console.log(location);
  };

  const [panelTag, setPanelTag] = useState("");

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

  const [searchTerms, setSearchTerms] = useState({
    tag: "Туры",
    origin: "Астана",
    destination: allLocations ? allLocations[0]._id : null,
    startDate: new Date(),
    endDate: null,
    number: 1,
  });

  const [days, setDays] = useState(1);

  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(
    new Date(Date.now() + 3600 * 1000 * 24)
  );

  const [clientData, setClientData] = useState({
    endDate: new Date(Date.now() + 3600 * 1000 * 24),
    startDate: new Date(),
    peopleAmount: 1,
    daysAmount: 1,
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
      startDate: window.localStorage.getItem("startDate"),
      endDate: window.localStorage.getItem("endDate"),
      peopleAmount: window.localStorage.getItem("peopleAmount"),
      daysAmount: window.localStorage.getItem("daysAmount"),
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("startDate", clientData.startDate);
    window.localStorage.setItem("endDate", clientData.endDate);
    window.localStorage.setItem("daysAmount", clientData.daysAmount);
    window.localStorage.setItem("peopleAmount", clientData.peopleAmount);
  }, [clientData]);

  console.log(clientData);

  const handleTagChange = (text) => {
    setPanelTag(text);
    setSearchTerms({ ...searchTerms, tag: text });
  };

  const onSearchClick = (locationId) => {
    handleSearch(locationId);
  };

  return (
    <div className="search_box">
      <div className="search_top">
        {tags.map((tag, id) => {
          return (
            <SearchTag
              key={id}
              icon={tag.icon}
              text={tag.text}
              active={panelTag === tag.text ? true : false}
              handleTagChange={handleTagChange}
            />
          );
        })}
      </div>
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
                {allLocations ? (
                  allLocations.map((location, idx) => {
                    return (
                      <option
                        value={location._id}
                        selected={idx === 0 ? true : false}
                      >
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
        <div className="search_col">
          <img src={search4} alt="" className="search_bot-icon" />
          <div className="search_col-content">
            <div className="search_col-top">Кто?</div>
            <div className="search_col-bot">
              <input
                type="number"
                placeholder="1"
                name="number"
                value={searchTerms.number}
                onChange={(e) => {
                  setSearchTerms({ ...searchTerms, number: e.target.value });
                  // changeAmount(e.target.value);
                  setClientData({
                    ...clientData,
                    peopleAmount: e.target.value,
                  });
                  dispatch(setPeopleAmount(e.target.value));
                }}
              />
            </div>
          </div>
        </div>
        <div className="search_col">
          <button
            className="primary-btn yellow"
            onClick={() => {
              if (searchTerms.destination)
                handleSearch(searchTerms.destination);
            }}
          >
            Найти
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
