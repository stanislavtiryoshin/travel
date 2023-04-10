import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import PeopleSelect from "../../../components/SearchPanel/PeopleSelect";
import DatePicker from "react-datepicker";
import { Button } from "../../components/Layout";

import style from "./Home.module.scss";
import { tags } from "../../../components/SearchPanel/tags";
import search1 from "../../../assets/search/search1.svg";
import search2 from "../../../assets/search/search2.svg";
import tree from "../../../assets/tags/tag4.svg";

const Routes = ({
  setIsActive,
  setSearchTag,
  setStartDate,
  setEndDate,
  isActive,
  from,
  to,
  handleFromChange,
  startDate,
  handleToChange,
  endDate,
  handlePeopleSelect,
}) => {
  return (
    <>
      <div className={style.tour_container}>
        <h3 className={style.tour_title}>Найти подходящий тур</h3>

        <div className={style.nav_btns_container}>
          {tags.map((tag, idx) => (
            <NavLink
              to={tag.path}
              key={idx}
              className={({ isActive }) =>
                isActive
                  ? `${style.active} ${style.nav_btn}`
                  : `${style.nav_btn}`
              }
            >
              <div>{tag.icon}</div>
              {tag.text}
            </NavLink>
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
      <Outlet />
    </>
  );
};

export default Routes;
