import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import RangeSlider from "react-range-slider-input";
import HotelSlice, {
  selectHotels,
  setFilterData,
  clearFilterData,
} from "../../features/hotel/hotelSlice";
import HotelStars from "../HotelStars/HotelStars";
import person2 from "../../assets/person2.svg";
import calendar from "../../assets/calendar.svg";
import plane from "../../assets/plane.svg";
import star from "../../assets/star.svg";
import check from "../../assets/filter/check.svg";

import "./Filter.scss";
import CheckBtn from "./CheckBtn";

const Filter = () => {
  const selectedHotels = useSelector(selectHotels);
  const dispatch = useDispatch();

  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const { filterData } = useSelector((state) => state.hotels);

  const [filterObj, setFilterObj] = useState({
    filterMaxPrice: 100000,
    filterMinPrice: 0,
    filterFood: [],
    filterRating: null,
    filterStars: null,
  });

  const handleSetFilterData = () => {
    dispatch(setFilterData(filterObj));
  };

  const handleClearFilterData = () => {
    dispatch(clearFilterData());
  };

  const [value, setValue] = useState([0, 600000]);

  useEffect(() => {
    setFilterObj({
      ...filterObj,
      filterMaxPrice: value[1],
      filterMinPrice: value[0],
    });
  }, [value]);

  const [allFoods, setAllFoods] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/foods`)
      .then((response) => {
        setAllFoods(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [currentLocation, setCurrentLocation] = useState("");

  const stars = [5, 4, 3, 2];

  return (
    <div className="filter_box">
      {/* <div className="filter_row">
        <div className="filter_title">Ваш запрос</div>
        <div className="icon_row row">
          <img src={plane} alt="" />
          {currentLocation && currentLocation?.locationName ? (
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
          <RangeSlider onInput={setValue} min={0} max={600000} step={1000} />
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
        {allFoods
          ? allFoods.map((food, idx) => {
              const isActive = filterObj.filterFood.includes(food._id);
              return (
                <div
                  key={food._id}
                  className="filter_content"
                  onClick={() => {
                    console.log(food._id);
                    if (isActive) {
                      setFilterObj((prevState) => ({
                        ...prevState,
                        filterFood: prevState.filterFood.filter(
                          (el) => el !== food._id
                        ),
                      }));
                    } else {
                      setFilterObj({
                        ...filterObj,
                        filterFood: [...filterObj.filterFood, food._id],
                      });
                    }
                  }}
                >
                  <button
                    className={isActive ? "check-btn active" : "check-btn"}
                  >
                    {isActive ? <img src={check} alt="" /> : null}
                  </button>
                  {food.label}
                </div>
              );
            })
          : null}
      </div>
      <div className="filter_row">
        <div className="filter_title">Количество звезд</div>
        <div
          className="filter_content"
          onClick={() => setFilterObj({ ...filterObj, filterStars: null })}
        >
          <CheckBtn isActive={filterObj.filterStars === null} />
          Любой класс
        </div>
        {stars
          ? stars.map((star, idx) => {
              const isActive = filterObj.filterStars === star;
              return (
                <div
                  key={star}
                  className="filter_content"
                  onClick={() =>
                    setFilterObj({ ...filterObj, filterStars: star })
                  }
                >
                  <CheckBtn isActive={isActive} />
                  <HotelStars number={star} />
                </div>
              );
            })
          : null}
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
        <button
          className="primary-btn"
          onClick={() => handleSetFilterData(filterObj)}
        >
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
