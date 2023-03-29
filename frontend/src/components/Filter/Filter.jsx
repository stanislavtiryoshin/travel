import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import RangeSlider from "react-range-slider-input";
import {
  selectHotels,
  setFilterData,
  clearFilterData,
} from "../../features/hotel/hotelSlice";
import person2 from "../../assets/person2.svg";
import calendar from "../../assets/calendar.svg";
import plane from "../../assets/plane.svg";
import star from "../../assets/star.svg";

const Filter = () => {
  const selectedHotels = useSelector(selectHotels);
  const dispatch = useDispatch();
  const { filterData } = useSelector((state) => state.hotels);

  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const [filterObj, setFilterObj] = useState({
    filterMaxPrice: 10000,
    filterMinPrice: 0,
    filterFood: null,
    filterRating: null,
  });

  const handleSetFilterData = () => {
    dispatch(setFilterData(filterObj));
  };

  const handleClearFilterData = () => {
    dispatch(clearFilterData());
  };

  const [value, setValue] = useState([0, 10000]);

  useEffect(() => {
    setFilterObj({
      ...filterObj,
      filterMaxPrice: value[1],
      filterMinPrice: value[0],
    });
  }, [value]);

  console.log(filterObj);

  return (
    <div className="filter_box">
      {/* <div className="filter_row">
        <div className="filter_title">Ваш запрос</div>
        <div className="icon_row row">
          <img src={plane} alt="" />
          {currentLocation?.locationName ? (
            <>
              {currentLocation?.locationName} &#183;{" "}
              {currentLocation?.locationCountry}
            </>
          ) : (
            "Весь Казахстан"
          )}
        </div>
        <div className="icon_row row">
          <img src={calendar} alt="" />
          {new Date(startDate).toLocaleString(undefined, {
            month: "numeric",
            day: "numeric",
          })}{" "}
          -{" "}
          {new Date(endDate).toLocaleString(undefined, {
            month: "numeric",
            day: "numeric",
          })}
        </div>
        <div className="icon_row row">
          <img src={person2} alt="" />
          {peopleAmount} взр.
        </div>
        <div className="icon_row row">
          <button className="check-btn"></button>
          Показывать с доп. местом
        </div>
      </div> */}
      <div className="filter_row">
        <div className="filter_title">Цена</div>
        <div className="filter_content price_range">
          <RangeSlider onInput={setValue} min={0} max={100000} step={1000} />
          <div className="price-box">
            <div className="price-col left">
              <div className="price-col-title">от</div>
              <div className="price-col-text">{filterObj.filterMinPrice}</div>
            </div>
            <div className="price-col">
              <div className="price-col-title">до</div>
              <div className="price-col-text">{filterObj.filterMaxPrice}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="filter_row">
        <div className="filter_title">Вид отдыха</div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Экскурсия
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Конные туры
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Пляжные туры
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Пляжные туры
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Необычные туры
        </div>
      </div>
      <div className="filter_row">
        <div className="filter_title">Питание</div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Все включено
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Только завтрак
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Завтрак и ужин
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          3-х разовое
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Без питания
        </div>
      </div>
      <div className="filter_row">
        <div className="filter_title">Количество звезд</div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Любой класс
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          <img src={star} alt="" />
          <img src={star} alt="" />
          <img src={star} alt="" />
          <img src={star} alt="" />
          <img src={star} alt="" />
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          <img src={star} alt="" />
          <img src={star} alt="" />
          <img src={star} alt="" />
          <img src={star} alt="" />
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          <img src={star} alt="" />
          <img src={star} alt="" />
          <img src={star} alt="" />
        </div>

        <div className="filter_content">
          <button className="check-btn"></button>
          <img src={star} alt="" />
          <img src={star} alt="" />
        </div>
      </div>
      <div className="filter_row">
        <div className="filter_title">Тип тура</div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Индивидуальный
        </div>
        <div className="filter_content">
          <button className="check-btn"></button>
          Групповой
        </div>
      </div>
      <div className="filter_row no-border">
        <button className="primary-btn" onClick={() => handleSetFilterData()}>
          Отфильтровать
        </button>
        <button
          className="primary-btn yellow"
          onClick={() => handleClearFilterData()}
        >
          Сбросить фильтр
        </button>
      </div>
    </div>
  );
};

export default Filter;
