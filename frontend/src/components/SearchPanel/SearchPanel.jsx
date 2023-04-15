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
  setSearchOptions,
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
import { getTours } from "../../features/tour/tourSlice";

const SearchPanel = ({ isUserLook, style }) => {
  const dispatch = useDispatch();

  const { chosenTag } = useSelector((state) => state.client);

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
    peopleAmount: 1,
    adultAmount: 1,
    kidsAmount: 0,
  });

  const [clientData, setClientData] = useState({
    endDate: Date.parse(endingDate),
    startDate: Date.parse(startingDate),
    peopleAmount: 1,
    adultAmount: 1,
    kidsAmount: 0,
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
      peopleAmount: +localStorage.getItem("peopleAmount"),
      kidsAmount: +localStorage.getItem("kidsAmount"),
      adultAmount: +localStorage.getItem("adultAmount"),
      daysAmount: +localStorage.getItem("daysAmount"),
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("startDate", clientData.startDate);
    localStorage.setItem("endDate", clientData.endDate);
    localStorage.setItem("daysAmount", +clientData.daysAmount);
    localStorage.setItem("peopleAmount", +clientData.peopleAmount);
    localStorage.setItem("kidsAmount", +clientData.kidsAmount);
    localStorage.setItem("adultAmount", +clientData.adultAmount);
  }, [clientData]);

  const handleSearch = ({
    locationId,
    peopleAmount,
    daysAmount,
    startDate,
  }) => {
    if (chosenTag == "Отели") {
      dispatch(
        getSearchedHotels({ locationId, peopleAmount, daysAmount, startDate })
      );
    }
    if (chosenTag == "Лагеря") {
      dispatch(getCamps());
    }
    if (chosenTag == "1-3 дневные") {
      dispatch(getTours());
    }
  };

  const handleAdultSelect = (num) => {
    const parsedNum = Number(num);
    setSearchTerms({
      ...searchTerms,
      adultAmount: searchTerms.adultAmount + parsedNum,
      peopleAmount: searchTerms.peopleAmount + parsedNum,
    });
    setClientData({
      ...clientData,
      adultAmount: clientData.adultAmount + parsedNum,
      peopleAmount: clientData.peopleAmount + parsedNum,
    });
  };

  const handleKidsSelect = (num) => {
    setSearchTerms({
      ...searchTerms,
      kidsAmount: searchTerms.kidsAmount + 1,
      peopleAmount: searchTerms.peopleAmount + 1,
    });
    setClientData({
      ...clientData,
      kidsAmount: clientData.kidsAmount + 1,
      peopleAmount: clientData.peopleAmount + 1,
    });
  };

  useEffect(() => {
    dispatch(
      setSearchOptions({
        peopleAmount: clientData.peopleAmount,
        kidsAmount: clientData.kidsAmount,
        adultAmount: clientData.adultAmount,
      })
    );
  }, [clientData]);

  const [kidsArr, setKidsArr] = useState([]);

  return (
    <div className="search_box" style={style && { ...style }}>
      {!isUserLook && (
        <div className="search_top">
          {tags.map((tag, id) => {
            const isActive = chosenTag === tag.text;
            return (
              <SearchTag
                key={id}
                icon={tag.icon}
                text={tag.text}
                active={isActive}
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
          handleAdultSelect={handleAdultSelect}
          handleKidsSelect={handleKidsSelect}
          value={searchTerms.peopleAmount}
          kids={searchTerms.kidsAmount}
          adults={searchTerms.adultAmount}
        />
        <button
          className="primary-btn yellow"
          onClick={() => {
            console.log("adf");
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
