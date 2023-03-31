import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../../components/HotelCard/HotelCard";
import { login, reset } from "../../features/auth/authSlice";
import {
  getSearchedHotels,
  selectHotels,
} from "../../features/hotel/hotelSlice";
import "react-range-slider-input/dist/style.css";
import Hero from "../../components/Hero/Hero";
import banner from "../../assets/banner.png";
import sort from "../../assets/sort.svg";
import media from "../../assets/media.svg";
import media1 from "../../assets/media1.svg";
import media2 from "../../assets/media2.svg";
import ad from "../../assets/ad.png";

import "./Home.scss";

import Filter from "../../components/Filter/Filter";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hotelsToShow, setHotelsToShow] = useState(5);

  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const selectedHotels = useSelector(selectHotels);

  console.log(hotels);

  const { startDate, endDate, peopleAmount, daysAmount, destination } =
    useSelector((state) => state.client);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(
      getSearchedHotels({
        locationId: "",
        peopleAmount: 1,
        daysAmount: 2,
        startDate: Date.parse(new Date()),
      })
    );
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  // const handleSearch = (location) => {
  //   dispatch(getSearchedHotels({ location: location }));
  // };

  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    if (destination)
      axios
        .get(`http://localhost:3000/api/locations/${destination}`)
        .then((response) => {
          setCurrentLocation(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [destination]);

  return (
    <div className="main_page">
      <Hero />
      <section className="all_hotels_section">
        <div className="main_wrapper wrapper">
          <div className="main_side">
            {/* <div className="filter_box">
              <div className="filter_row">
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
              </div>
              <div className="filter_row">
                <div className="filter_title">Цена</div>
                <div className="filter_content price_range">
                  <RangeSlider
                    onInput={setValue}
                    min={0}
                    max={100000}
                    step={1000}
                  />
                  <div className="price-box">
                    <div className="price-col left">
                      <div className="price-col-title">от</div>
                      <div className="price-col-text">{value[0]}</div>
                    </div>
                    <div className="price-col">
                      <div className="price-col-title">до</div>
                      <div className="price-col-text">{value[1]}</div>
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
                <button
                  className="primary-btn"
                  onClick={() => handleFilter(from, to)}
                >
                  Отфильтровать
                </button>
                <button
                  className="primary-btn yellow"
                  onClick={() => dropFilter()}
                >
                  Сбросить фильтр
                </button>
              </div>
            </div> */}
            <Filter />
          </div>
          <div className="container main_container">
            <div className="all_hotels_wrapper wrapper ver">
              <img src={banner} alt="" className="banner" />

              <div className="all_hotels-top">
                <div className="all_hotels-num">
                  Найдено: <span>{selectedHotels?.length}</span>
                </div>
                <button className="sort-btn">
                  Сортировать <img src={sort} alt="" />
                </button>
              </div>
              {selectedHotels &&
                selectedHotels
                  ?.filter((hotel, idx) => idx < hotelsToShow)
                  .map((hotel, idx) => {
                    return (
                      <HotelCard
                        key={idx}
                        hotelId={hotel._id}
                        name={hotel.name}
                        locationId={hotel.locationId}
                        price={hotel.price * peopleAmount}
                        amount={peopleAmount}
                        days={daysAmount}
                        description={hotel.description}
                        rating={hotel.rating}
                        startDate={startDate}
                        endDate={endDate}
                        rooms={hotel.rooms}
                        totalPrice={hotel.totalPrice}
                        oldPrice={hotel.oldPrice}
                        hotelStars={hotel.hotelStars}
                      />
                    );
                  })}
              {selectedHotels.length >= hotelsToShow ? (
                <button
                  className="more-hotels-btn"
                  onClick={() => setHotelsToShow(hotelsToShow + 5)}
                >
                  Загрузить еще...
                </button>
              ) : null}
            </div>
          </div>
          <div className="hotel_ad_wrapper wrapper ver">
            <div className="hotel_ad_top shadowed_box">
              <a href="">
                <img src={media} alt="" />
              </a>
              <a href="">
                <img src={media1} alt="" />
              </a>
              <a href="">
                <img src={media2} alt="" />
              </a>
            </div>
            <div className="hotel_ad-box shadowed_box">
              <img src={ad} alt="" />
            </div>
            <div className="hotel_ad-box shadowed_box">
              <img src={ad} alt="" />
            </div>
            <div className="hotel_ad-box shadowed_box">
              <img src={ad} alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
