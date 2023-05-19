import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import RangeSlider from "react-range-slider-input";

// import plane from "../../assets/plane.svg";

import {
  selectHotels,
  setFilterData as setHotelFilterData,
  clearFilterData,
} from "../../features/hotel/hotelSlice";
import {
  setFilterData as setTourFilterData,
  clearFilterData as clearTourFilterData,
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
  useLazyGetHotelsByFilterQuery,
  useLazyGetTourByFilterQuery,
} from "../../features/services/filter.service";
import FilterBtn from "./FilterBtn";

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

  const [tourFilter, setTourFilter] = useState({
    locationId: "",
    duration: "",
    rating: "",
    food: [],
    paymentType: "",
    start: JSON.parse(localStorage.getItem("startDate")) || "",
    adultsAmount:
      JSON.parse(localStorage.getItem("agesArray")).filter(
        (age) => age === 1000
      ).length || 1,
    kidsAmount:
      JSON.parse(localStorage.getItem("agesArray")).filter(
        (age) => age !== 1000
      ).length || 0,
  });

  const { searchFilter } = useSelector((state) => state.search);
  const [hotelFilter, setHotelFilter] = useState({
    locationId: localStorage.getItem("locationId") || "",
    filterFood: [],
    filterServices: [],
    filterStars: "",
    filterRating: [],
    filterExtraPlaces: true,
    filterBathroom: "",
    start: JSON.parse(localStorage.getItem("startDate")) || "",
    adultsAmount:
      JSON.parse(localStorage.getItem("agesArray")).filter(
        (age) => age === 1000
      ).length || 1,
    kidsAmount:
      JSON.parse(localStorage.getItem("agesArray")).filter(
        (age) => age !== 1000
      ).length || 0,
  });

  useEffect(() => {
    setHotelFilter({
      ...hotelFilter,
      locationId: searchFilter.locationId || "",
      daysAmount: searchFilter.daysAmount || 1,
      kidsAmount: searchFilter.agesArray.filter((age) => age !== 1000).length,
      adultsAmount: searchFilter.agesArray.filter((age) => age === 1000).length,
    });
  }, [searchFilter]);

  // console.log(hotelFilter, "hotelfilter");
  // console.log(searchFilter, "filter data");

  const [filterTours, { isLoading: tourIsLoading }] =
    useLazyGetTourByFilterQuery();

  const [filterHotels, { isLoading: hotelIsLoading }] =
    useLazyGetHotelsByFilterQuery();

  const [filterObj, setFilterObj] = useState({
    filterMaxPrice: maxPrice ? maxPrice : 600000,
    filterMinPrice: minPrice ? minPrice : 0,
    filterFood: [],
    filterRating: null,
    filterStars: null,
  });

  // const handleSetFilterData = () => {
  //   dispatch(setFilterData(filterObj));
  // };

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

  const applyFilter = (tourFilterObj) => {
    filterTours(tourFilterObj).then(({ data }) => {
      dispatch(setTourFilterData(data));
    });
  };

  const applyHotelFilter = (hotelFilterObj) => {
    filterHotels(hotelFilterObj).then(({ data }) => {
      dispatch(setHotelFilterData(data));
    });
  };

  const setFilter = () => {
    switch (mode) {
      case "tour":
        applyFilter(tourFilter);
        break;
      case "hotel":
        applyHotelFilter(hotelFilter);
        console.log(hotelFilter, "set filter");
        break;
      case "sanatorium":
        dispatch(setSanFilterData(filterObj));
        break;
    }
  };

  const handleFoodFilter = (foodId) => {
    switch (mode) {
      case "hotel":
        if (hotelFilter.filterFood.some((el) => el === foodId)) {
          setHotelFilter((prevState) => ({
            ...prevState,
            filterFood: prevState.filterFood.filter((el) => el !== foodId),
          }));
        } else {
          setHotelFilter({
            ...hotelFilter,
            filterFood: [...hotelFilter.filterFood, foodId],
          });
        }
      case "tour":
        if (tourFilter.food.some((el) => el === foodId)) {
          setTourFilter((prevState) => ({
            ...prevState,
            food: prevState.food.filter((el) => el !== foodId),
          }));
        } else {
          setTourFilter((prev) => ({
            ...prev,
            food: [...prev.food, foodId],
          }));
        }
    }
  };

  const handleExtraPlacesFilter = () => {
    setHotelFilter({
      ...hotelFilter,
      filterExtraPlaces: !hotelFilter.filterExtraPlaces,
    });
  };

  const handleStarsFilter = (stars) => {
    if (hotelFilter.filterStars === stars) {
      setHotelFilter((prevState) => ({
        ...prevState,
        filterStars: "",
      }));
    } else {
      setHotelFilter({
        ...hotelFilter,
        filterStars: stars,
      });
    }
  };

  const handleRatingFilter = (rating) => {
    if (
      hotelFilter.filterRating[0] === rating[0] &&
      hotelFilter.filterRating[1] === rating[1]
    ) {
      setHotelFilter({ ...hotelFilter, filterRating: [] });
    } else {
      setHotelFilter({ ...hotelFilter, filterRating: rating });
    }
  };

  const clearFilter = () => {
    switch (mode) {
      case "tour":
        dispatch(clearTourFilterData());
      case "hotel":
        const newHotelFilter = {
          ...hotelFilter,
          filterFood: [],
          filterServices: [],
          filterStars: "",
          filterRating: "",
          filterExtraPlaces: true,
          filterBathroom: "",
        };
        setHotelFilter(newHotelFilter);
        applyHotelFilter(newHotelFilter);
      case "sanatorium":
        dispatch(clearSanFilterData());
    }
  };

  console.log(hotelFilter);

  return (
    <div className="filter_box">
      {!location.pathname.includes("/dashboard") ? (
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
      ) : null}

      {!location.pathname.includes("/dashboard") ? (
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
      ) : null}

      <div className="filter_row">
        <div className="filter_title">Питание</div>
        {allFoods
          ? allFoods.map((food, idx) => {
              const isActive = hotelFilter?.filterFood?.includes(food._id);
              const tourIsActive = tourFilter?.food?.includes(food._id);
              return (
                <FilterBtn
                  isActive={isActive}
                  onClick={() => {
                    handleFoodFilter(food._id);
                  }}
                  label={food.label}
                  key={food.label}
                />
              );
            })
          : null}
      </div>
      <div className="filter_row">
        <div className="filter_title">Доп. места</div>
        <FilterBtn
          isActive={hotelFilter.filterExtraPlaces}
          label={"Есть"}
          onClick={() =>
            handleExtraPlacesFilter(!hotelFilter.filterExtraPlaces)
          }
        />
      </div>
      <div className="filter_row">
        <div className="filter_title">Количество звезд</div>
        <FilterBtn
          isActive={hotelFilter.filterStars === ""}
          label={"Любой класс"}
          key={123}
          onClick={() => handleStarsFilter("")}
        />
        {console.log(hotelFilter, "hotel filter")}
        {stars
          ? stars.map((star, idx) => {
              const isActive = hotelFilter?.filterStars === star;
              return (
                <>
                  <FilterBtn
                    isActive={isActive}
                    label={<HotelStars number={star} />}
                    key={star}
                    onClick={() => handleStarsFilter(star)}
                  />
                </>
              );
            })
          : null}
      </div>
      <div className="filter_row">
        <div className="filter_title">Рейтинг</div>
        <FilterBtn
          isActive={hotelFilter.filterRating.length === 0}
          label={"Любой"}
          onClick={() => handleRatingFilter([])}
        />
        <FilterBtn
          isActive={
            hotelFilter?.filterRating[0] === 2 &&
            hotelFilter?.filterRating[1] === 3
          }
          label={"2-3"}
          onClick={() => handleRatingFilter([2, 3])}
        />
        <FilterBtn
          isActive={
            hotelFilter?.filterRating[0] === 3 &&
            hotelFilter?.filterRating[1] === 4
          }
          label={"3-4"}
          onClick={() => handleRatingFilter([3, 4])}
        />
        <FilterBtn
          isActive={
            hotelFilter?.filterRating[0] === 4 &&
            hotelFilter?.filterRating[1] === 5
          }
          label={"4-5"}
          onClick={() => handleRatingFilter([4, 5])}
        />
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

{
  /* <div className="filter_row">
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
</div>; */
}

{
  /* <div className="filter_row">
  <div className="filter_title">Тип тура</div>
  <div className="filter_content">
    <button className="check-btn"></button>
    Индивидуальный
  </div>
  <div className="filter_content">
    <button className="check-btn"></button>
    Групповой
  </div>
</div>; */
}
