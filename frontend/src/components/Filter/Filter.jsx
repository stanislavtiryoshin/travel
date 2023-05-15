import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import RangeSlider from "react-range-slider-input";

// import plane from "../../assets/plane.svg";

import {
  selectHotels,
  setFilterData,
  clearFilterData,
} from "../../features/hotel/hotelSlice";
import {
  setFilterData as setTourFilterData,
  clearFilterData as clearTourFilterData,
  selectTours,
} from "../../features/tour/tourSlice";
import {
  setFilterData as setSanFilterData,
  clearFilterData as clearSanFilterData,
  selectSanatoriums,
} from "../../features/sanatorium/sanatoriumSlice";

import HotelStars from "../HotelStars/HotelStars";
import person2 from "../../assets/person2.svg";
import calendar from "../../assets/calendar.svg";
import plane from "../../assets/plane.svg";
import star from "../../assets/star.svg";
import check from "../../assets/filter/check.svg";

import "./Filter.scss";
import CheckBtn from "./CheckBtn";
import {
  useGetTourByFilterQuery,
  useLazyGetTourByFilterQuery,
} from "../../features/services/filter.service";

const Filter = ({ mode }) => {
  const dispatch = useDispatch();

  const selectedHotels = useSelector(selectHotels);
  const { hotels } = useSelector((state) => state.hotels);
  const selectedSanatoriums = useSelector(selectSanatoriums);
  const { sanatoriums } = useSelector((state) => state.sanatoriums);
  const { tours } = useSelector((state) => state.tour);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minPrice, setMinPrice] = useState(0);

  useEffect(() => {
    switch (mode) {
      case "hotel":
        setMaxPrice(
          hotels?.reduce(
            (acc, curr) => {
              if (curr.totalPrice > acc.totalPrice) {
                return curr;
              } else {
                return acc;
              }
            },
            { totalPrice: 0 }
          ).totalPrice
        );
        setMinPrice(
          hotels?.reduce(
            (acc, curr) => {
              if (curr.totalPrice < acc.totalPrice) {
                return curr;
              } else {
                return acc;
              }
            },
            { totalPrice: 0 }
          ).totalPrice
        );
        break;
      case "sanatorium":
        setMaxPrice(
          sanatoriums?.reduce(
            (acc, curr) => {
              if (curr.totalPrice > acc.totalPrice) {
                return curr;
              } else {
                return acc;
              }
            },
            { totalPrice: 0 }
          ).totalPrice
        );
        setMinPrice(
          sanatoriums?.reduce(
            (acc, curr) => {
              if (curr.totalPrice < acc.totalPrice) {
                return curr;
              } else {
                return acc;
              }
            },
            { totalPrice: 0 }
          ).totalPrice
        );
        break;
      case "tour":
        setMaxPrice(
          tours?.reduce(
            (acc, curr) => {
              if (curr.totalPrice > acc.totalPrice) {
                return curr;
              } else {
                return acc;
              }
            },
            { totalPrice: 0 }
          ).totalPrice
        );
        setMinPrice(
          tours?.reduce(
            (acc, curr) => {
              if (curr.totalPrice < acc.totalPrice) {
                return curr;
              } else {
                return acc;
              }
            },
            { totalPrice: 0 }
          ).totalPrice
        );
        break;
    }
  }, [mode, hotels, sanatoriums, tours]);

  const [value, setValue] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const { filterData } = useSelector((state) => state.tour);
  const [tourFilter, setTourFilter] = useState({
    locationId: "",
    duration: "",
    rating: "",
    food: [],
    paymentType: "",
  });

  const [filterTours, { isLoading: tourIsLoading }] =
    useLazyGetTourByFilterQuery();

  const [filterObj, setFilterObj] = useState({
    filterMaxPrice: maxPrice ? maxPrice : 600000,
    filterMinPrice: minPrice ? minPrice : 0,
    filterFood: [],
    filterRating: null,
    filterStars: null,
  });

  const handleSetFilterData = () => {
    dispatch(setFilterData(filterObj));
  };

  const handleClearFilterData = () => {
    dispatch(clearFilterData());
    setFilterObj({
      filterMaxPrice: maxPrice ? maxPrice : 600000,
      filterMinPrice: minPrice ? minPrice : 0,
      filterFood: [],
      filterRating: null,
      filterStars: null,
    });
  };

  const [startTime] = useState(
    new Date(JSON.parse(localStorage.getItem("startDate")))
  );

  const [endTime] = useState(
    new Date(JSON.parse(localStorage.getItem("endDate")))
  );

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
      .get(`/api/foods`)
      .then((response) => {
        setAllFoods(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [currentLocation, setCurrentLocation] = useState("");

  const stars = [5, 4, 3, 2];

  const applyFilter = () => {
    filterTours(tourFilter).then(({ data }) => {
      console.log(data, "filtered tours data");
      dispatch(setTourFilterData(data));
    });
  };

  const setFilter = () => {
    switch (mode) {
      case "tour":
        applyFilter();
        break;
      case "hotel":
        dispatch(setFilterData(filterObj));
        break;
      case "sanatorium":
        dispatch(setSanFilterData(filterObj));
        break;
    }
  };

  const clearFilter = () => {
    switch (mode) {
      case "tour":
        dispatch(clearTourFilterData());
      case "hotel":
        dispatch(clearFilterData());
      case "sanatorium":
        dispatch(clearSanFilterData());
    }
  };

  return (
    <div className="filter_box">
      <div>
        <div className="filter_title">Ваш запрос</div>
        <div className="filter_content">
          <div className="filter_destination">
            <img src={plane} alt="Откуда" />
            Астана <div className="filter_divider"></div>{" "}
            {localStorage.getItem("to")}
          </div>
        </div>
        <div className="filter_content users">
          <div className="filter_dateRange">
            <img src={calendar} alt="Календарь" />
            {startTime.getDay() < 9
              ? "0" + (startTime.getDay() + 1)
              : startTime.getDay() + 1}
            .
            {startTime.getMonth() < 9
              ? "0" + (startTime.getMonth() + 1)
              : startTime.getMonth() + 1}{" "}
            -{" "}
            {endTime.getDay() < 9
              ? "0" + (endTime.getDay() + 1)
              : endTime.getDay() + 1}
            .
            {endTime.getMonth() < 9
              ? "0" + (endTime.getMonth() + 1)
              : endTime.getMonth() + 1}
          </div>
        </div>
        <div className="filter_content users">
          <div className="filter_userAmount">
            <img src={person2} alt="Люди" />
            {localStorage.getItem("agesArray") &&
              JSON.parse(localStorage.getItem("agesArray")).filter(
                (age) => age === 1000
              ).length}{" "}
            взр.
            {localStorage.getItem("agesArray") &&
              JSON.parse(localStorage.getItem("agesArray")).filter(
                (age) => age !== 1000
              ).length !== 0 && (
                <>
                  {localStorage.getItem("agesArray") &&
                    JSON.parse(localStorage.getItem("agesArray")).filter(
                      (age) => age !== 1000
                    ).length}{" "}
                  дет.
                </>
              )}
          </div>
        </div>
      </div>

      {location.pathname !== "/dashboard" ? (
        <div className="filter_row">
          <div className="filter_title">Цена</div>
          <div className="filter_content price_range">
            {selectedHotels || (selectedSanatoriums && maxPrice !== 100) ? (
              <RangeSlider
                onInput={setValue}
                value={value}
                min={minPrice}
                max={maxPrice}
                step={100}
              />
            ) : null}
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
      ) : null}
      {mode === "tour" ? (
        <div className="filter_row">
          <div className="filter_title">Длительность тура</div>
          <div
            className="filter_content"
            onClick={() => setTourFilter((prev) => ({ ...prev, duration: "" }))}
          >
            <button className="check-btn"></button>Все
          </div>
          <div
            className="filter_content"
            onClick={() => setTourFilter((prev) => ({ ...prev, duration: 3 }))}
          >
            <button className="check-btn"></button>3 дня
          </div>
          <div
            className="filter_content"
            onClick={() => setTourFilter((prev) => ({ ...prev, duration: 2 }))}
          >
            <button className="check-btn"></button>2 дня
          </div>
          <div
            className="filter_content"
            onClick={() => setTourFilter((prev) => ({ ...prev, duration: 1 }))}
          >
            <button className="check-btn"></button>1 день
          </div>
        </div>
      ) : (
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
      )}

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
                    if (mode === "tour") {
                      if (!tourFilter.food.includes(food._id)) {
                        setTourFilter((prev) => ({
                          ...prev,
                          food: [...prev.food, food._id],
                        }));
                      } else {
                        setTourFilter((prev) => ({
                          ...prev,
                          food: prev.food.filter((el) => el !== food._id),
                        }));
                      }
                    } else {
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
          onClick={() => {
            mode === "tour"
              ? setTourFilter((prev) => ({
                  ...prev,
                  rating: "",
                }))
              : setFilterObj({ ...filterObj, filterStars: null });
          }}
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
                  onClick={() => {
                    console.log(star, "star");
                    if (mode === "tour") {
                      setTourFilter((prev) => ({ ...prev, rating: star }));
                    }
                    setFilterObj({ ...filterObj, filterStars: star });
                  }}
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
        <button className="primary-btn" onClick={() => setFilter()}>
          Отфильтровать
        </button>
        <button className="primary-btn yellow" onClick={() => clearFilter()}>
          Сбросить фильтр
        </button>
      </div>
    </div>
  );
};

export default Filter;
