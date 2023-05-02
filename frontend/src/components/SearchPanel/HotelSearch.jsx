import React, { useState, useEffect } from "react";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";

import { useDispatch } from "react-redux";

import "./SearchPanel.scss";

import tag1 from "../../assets/tags/tag1.svg";
import tag2 from "../../assets/tags/tag2.svg";
import tag3 from "../../assets/tags/tag3.svg";
import tag4 from "../../assets/tags/tag4.svg";
import tag5 from "../../assets/tags/tag5.svg";

import { getAdminHotels, reset } from "../../features/hotel/hotelSlice";

const HotelSearch = ({
  hotelMode,
  tourMode,
  campMode,
  sanMode,
  reqMode,
  handleStatus,
  handleQuery,
  find,
  query,
}) => {
  const dispatch = useDispatch();

  const [panelTag, setPanelTag] = useState("");

  const [allLocations, setAllLocations] = useState(null);

  useEffect(() => {
    axios
      .get(`https://easy-plum-panther-tam.cyclic.app/api/locations`)
      .then((response) => {
        setAllLocations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [searchTerms, setSearchTerms] = useState({
    name: "",
    locationId: "",
    minAge: null,
  });

  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(
    new Date(Date.now() + 3600 * 1000 * 24)
  );

  const [clientData, setClientData] = useState({
    endDate: Date.parse(new Date(Date.now() + 3600 * 1000 * 24)),
    startDate: Date.parse(new Date()),
    peopleAmount: 1,
    daysAmount: 2,
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

  const handleTagChange = (text) => {
    setPanelTag(text);
    setSearchTerms({ ...searchTerms, tag: text });
  };

  const handleSearch = () => {
    if (hotelMode) dispatch(getAdminHotels(searchTerms));
    console.log(searchTerms);
  };

  return (
    <section className="dash_search_section">
      <div className="container">
        <div className="dash_search_wrapper wrapper ver">
          <div className="dash_heading">{reqMode ? "Заявки" : "Отели"}</div>
          <div className={reqMode ? "search_box req" : "search_box"}>
            <div className="search_bot">
              <div className="search_col">
                <div className="search_col-content">
                  <div className="search_col-bot">
                    <input
                      type="text"
                      placeholder={
                        reqMode
                          ? "Поиск по имени или названию"
                          : "Название или ID"
                      }
                      name="origin"
                      value={reqMode ? query : searchTerms.name}
                      onChange={(e) => {
                        if (reqMode) {
                          handleQuery(e.target.value);
                        } else {
                          setSearchTerms({
                            ...searchTerms,
                            name: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {reqMode && (
                <div className="search_col">
                  <div className="search_col-content">
                    <div className="search_col-top">Тип услуги</div>
                    <div className="search_col-bot">
                      <select type="text" name="services">
                        <option selected>Отель</option>
                        <option>Тур (если отель с туром)</option>
                        <option>1-3 тур</option>
                        <option>Санаторий</option>
                        <option>Лагерь</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="search_col">
                <div className="search_col-content">
                  <div className="search_col-top">Где?</div>
                  <div className="search_col-bot">
                    <select
                      type="text"
                      name="destination"
                      value={searchTerms.locationId}
                      onChange={(e) => {
                        setSearchTerms({
                          ...searchTerms,
                          locationId: e.target.value,
                        });
                      }}
                    >
                      <option value="" selected>
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

              {reqMode && (
                <div className="search_col">
                  <div className="search_col-content">
                    <div className="search_col-top">Статус</div>
                    <div className="search_col-bot">
                      <select
                        type="text"
                        name="status"
                        onChange={(e) => {
                          handleStatus(e.target.value);
                        }}
                      >
                        <option value="" selected>
                          Любой статус
                        </option>
                        <option value="В обработке">В обработке</option>
                        <option value="Отклонено">Отклонено</option>
                        <option value="Оплачено">Оплачено</option>
                        <option value="На паузе">На паузе</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {reqMode ? (
                <div className="search_col">
                  <div className="search_col-content">
                    <div className="search_col-top">Когда?</div>
                    <div className="search_col-bot">
                      <label htmlFor="dates">Любые даты</label>
                      <input
                        type="date"
                        placeholder="Любые даты"
                        hidden
                        id="dates"
                        name="dates"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="search_col">
                  <div className="search_col-content">
                    <div className="search_col-top">Мин. возраст</div>
                    <div className="search_col-bot">
                      <input
                        type="number"
                        placeholder="Любой"
                        min={0}
                        max={18}
                        name="number"
                        value={searchTerms.minAge}
                        onChange={(e) => {
                          setSearchTerms({
                            ...searchTerms,
                            minAge: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                className="primary-btn yellow"
                onClick={() => {
                  if (reqMode) {
                    find();
                  } else {
                    handleSearch();
                  }
                }}
              >
                Найти
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelSearch;
