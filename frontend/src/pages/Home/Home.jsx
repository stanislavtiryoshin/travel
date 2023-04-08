import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../../components/HotelCard/HotelCard";
import { reset } from "../../features/auth/authSlice";
import {
  getSearchedHotels,
  selectHotels,
} from "../../features/hotel/hotelSlice";
import "react-range-slider-input/dist/style.css";
import Hero from "../../components/Hero/Hero";
import banner from "../../assets/banner.png";
import media from "../../assets/media.svg";
import media1 from "../../assets/media1.svg";
import media2 from "../../assets/media2.svg";
import ad from "../../assets/ad.png";

import "./Home.scss";

import Filter from "../../components/Filter/Filter";
import SortBtn from "../../components/Filter/SortBtn";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hotelsToShow, setHotelsToShow] = useState(5);

  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );
  const { tag } = useSelector((state) => state.client);
  console.log(tag);

  const selectedHotels = useSelector(selectHotels);

  const [panelTag, setPanelTag] = useState("Отели");

  const changeTag = (tag) => {
    setPanelTag(tag);
  };

  console.log(selectedHotels);

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

  console.log(hotels);

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

  const { user } = useSelector((state) => state.auth);

  console.log(user);

  return (
    <div className="main_page">
      <Hero />
      <section className="all_hotels_section">
        <div className="main_wrapper wrapper">
          <div className="main_side">
            <Filter />
          </div>
          <div className="container main_container">
            <div className="all_hotels_wrapper wrapper ver">
              <img src={banner} alt="" className="banner" />

              <div className="all_hotels-top">
                <div className="all_hotels-num">
                  Найдено: <span>{selectedHotels?.length}</span>
                </div>
                <SortBtn />
              </div>
              {selectedHotels && selectedHotels.length > 0 ? (
                selectedHotels
                  .filter((hotel, idx) => idx < hotelsToShow)
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
                  })
              ) : (
                <div>😭 Ничего не найдено...</div>
              )}
              {selectedHotels.length >= hotelsToShow ? (
                <button
                  className="sort-btn"
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
