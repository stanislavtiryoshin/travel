import { useState, lazy } from "react";
import DatePicker from "react-datepicker";

import style from "./Home.module.scss";
import search1 from "../../../assets/search/search1.svg";
import search2 from "../../../assets/search/search2.svg";
import tree from "../../../assets/tags/tag4.svg";

import { tags } from "../../../components/SearchPanel/tags";
import PeopleSelect from "../../../components/SearchPanel/PeopleSelect";
import { Button } from "../../components/Layout";
import Tour from "../../components/Tour/TourCard";
import Hotel from "../../components/Hotel/Hotel";
import Hot from "../../components/Hot/Hot";

const MobileHome = () => {
  const [searchTag, setSearchTag] = useState("Hotel");
  const [isActive, setIsActive] = useState(4);
  const [startDate, setStartDate] = useState(
    localStorage.getItem("startDate") !== "NaN"
      ? new Date(+JSON.parse(localStorage.getItem("startDate")))
      : new Date()
  );
  const [endDate, setEndDate] = useState(
    localStorage.getItem("endDate") !== "NaN"
      ? new Date(+JSON.parse(localStorage.getItem("endDate")))
      : new Date(Date.now() + 3600 * 1000 * 24)
  );

  const [from, setFrom] = useState(
    localStorage.getItem("from") ? localStorage.getItem("from") : ""
  );
  const [to, setTo] = useState(
    localStorage.getItem("to") ? localStorage.getItem("to") : ""
  );

  const handleFromChange = (e) => {
    setFrom(e.target.value);
    localStorage.setItem("from", e.target.value);
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
    localStorage.setItem("to", e.target.value);
  };
  const handlePeopleSelect = (num) => {
    console.log(num);
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.preview} />

        <div className={style.tour_container}>
          <h3 className={style.tour_title}>Найти подходящий тур</h3>

          <div className={style.nav_btns_container}>
            {tags.map((tag, idx) => (
              <div
                onClick={() => {
                  setIsActive(idx);
                  setSearchTag(tag.tag);
                }}
                key={idx}
                className={`${style.nav_btn} ${
                  isActive === idx ? style.active : ""
                }`}
              >
                <div>{tag.icon}</div>
                {tag.text}
              </div>
            ))}
          </div>

          <div className={style.inputs}>
            <div className={style.input}>
              <div className={style.field}>
                <img src={search1} alt="From" />
                <input
                  type="text"
                  placeholder="Откуда"
                  value={from}
                  onChange={handleFromChange}
                />
              </div>
              <DatePicker
                selected={startDate}
                placeholderText="Выбрать дату"
                onChange={(date) => {
                  setStartDate(date);
                  localStorage.setItem("startDate", Date.parse(date));
                }}
              />
            </div>
            <div className={style.input}>
              <div className={style.field}>
                <img src={search2} alt="To" />
                <input
                  type="text"
                  placeholder="Куда"
                  value={to}
                  onChange={handleToChange}
                />
              </div>
              <DatePicker
                selected={endDate}
                placeholderText="Выбрать дату"
                onChange={(date) => {
                  setEndDate(date);
                  localStorage.setItem("endDate", Date.parse(date));
                }}
              />
            </div>
          </div>
          <div className={style.input_who}>
            <PeopleSelect handlePeopleSelect={handlePeopleSelect} />
          </div>
          <div className={style.input_who}>
            <div>
              <img src={tree} alt="Отдых" />
              Отдых
            </div>

            <select className={style.holiday}>
              <option value="" selected disabled></option>
              <option value="">Экскурсия</option>
              <option value="">Конные туры</option>
              <option value="">Пляжные туры</option>
              <option value="">Свадебные туры</option>
              <option value="">Необычное туры</option>
              <option value="">Пляжные туры</option>
              <option value="">Свадебные туры</option>
            </select>
          </div>
          <Button btn="secondary">Найти тур</Button>
        </div>
        <div className={style.tag_content}>
          {searchTag === "Hotel" ? (
            <Hotel />
          ) : searchTag === "Tours" ? (
            <Tour />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
export default MobileHome;
