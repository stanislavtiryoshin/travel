import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset } from "../../features/auth/authSlice";
import { selectHotels } from "../../features/hotel/hotelSlice";
import "react-range-slider-input/dist/style.css";
import Hero from "../../components/Hero/Hero";
import media from "../../assets/media.svg";
import media1 from "../../assets/media1.svg";
import media2 from "../../assets/media2.svg";
import ad from "../../assets/ad.png";

import "./Home.scss";

import Filter from "../../components/Filter/Filter";
import Hotels from "./Hotels";
import { getSearchedHotels } from "../../features/hotel/hotelSlice";
import { getSanatoriums } from "../../features/sanatorium/sanatoriumSlice";
import { getCamps } from "../../features/camps/campSlice";
import { getTours } from "../../features/tour/tourSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );
  const { camps } = useSelector((state) => state.camps);
  const { tours } = useSelector((state) => state.tour);
  const { sanatoriums } = useSelector((state) => state.sanatoriums);
  const { startDate, endDate, peopleAmount, daysAmount, destination } =
    useSelector((state) => state.client);
  const selectedHotels = useSelector(selectHotels);
  // const selectedTours = useSelector(selectTours);

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
        adultsAmount: 1,
        kidsAmount: 0,
      })
    );
    dispatch(getSanatoriums());
    dispatch(getCamps());
    dispatch(getTours());

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  // const handleSearch = (location) => {
  //   dispatch(getSearchedHotels({ location: location }));
  // };

  const [currentLocation, setCurrentLocation] = useState();

  const { chosenTag } = useSelector((state) => state.client);

  useEffect(() => {
    if (destination)
      axios
        .get(
          `https://easy-plum-panther-tam.cyclic.app/api/locations/${destination}`
        )
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
            <Filter mode={chosenTag === "Туры" ? "tour" : ""} />
          </div>
          <div className="container main_container">
            {chosenTag === "Отели" ? (
              <Hotels
                mode={"hotels"}
                selectedHotels={selectedHotels}
                hotelsMode
              />
            ) : null}
            {chosenTag === "Лагеря" ? (
              <Hotels mode={"camps"} selectedHotels={camps} campsMode />
            ) : null}
            {chosenTag === "Туры" ? (
              <Hotels mode={"tour"} selectedHotels={tours} toursMode />
            ) : null}
            {chosenTag === "Санатории" ? (
              <Hotels
                mode={"sanatoriums"}
                selectedHotels={sanatoriums}
                sanatoriumsMode
              />
            ) : null}
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
