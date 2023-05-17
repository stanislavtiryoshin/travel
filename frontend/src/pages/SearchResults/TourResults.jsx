import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import banner from "../../assets/banner.png";
import SortBtn from "../../components/Filter/SortBtn";
import HotelCard from "../../components/HotelCard/HotelCard";
import { setFilterData } from "../../features/tour/tourSlice";

import { useNavigate } from "react-router-dom";

import Loader from "../../components/Loader";
import { useGetTourByFilterQuery } from "../../features/services/filter.service";

const TourResults = ({ mode }) => {
  const dispatch = useDispatch();

  const { data: tours = [], isLoading: LoadingTours } = useGetTourByFilterQuery(
    {
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
    }
  );

  const [tourData, setTourData] = useState([]);

  const { tours: tour, isLoading: tourIsLoad } = useSelector(
    (state) => state.tour
  );

  useEffect(() => {
    if (!LoadingTours) dispatch(setFilterData(tours));
  }, [tours, LoadingTours]);

  const [hotelsToShow, setHotelsToShow] = useState(5);
  const { startDate, endDate, peopleAmount, daysAmount, destination } =
    useSelector((state) => state.client);

  if (LoadingTours) {
    return <Loader />;
  }

  return (
    <div className="all_hotels_wrapper wrapper ver">
      <img src={banner} alt="" className="banner" />

      <div className="all_hotels-top">
        <div className="all_hotels-num">
          Найдено: <span>{tourData.length}</span>
        </div>
        <SortBtn mode={mode} />
      </div>
      {tour && tour.length > 0 ? (
        tour
          .filter((hotel, idx) => idx < hotelsToShow)
          .map((hotel, idx) => {
            return (
              <HotelCard
                program={hotel.program}
                key={hotel._id}
                hotelId={hotel._id}
                name={hotel.name}
                locationId={hotel.locationId}
                price={hotel.price}
                days={hotel.duration ? hotel.duration : 1}
                description={hotel.description}
                rating={hotel.rating}
                startDate={startDate}
                endDate={endDate}
                isTour
                totalPrice={hotel.totalPrice}
                oldPrice={hotel.oldPrice}
                hotelStars={hotel.hotelStars}
                mode="tour"
                adultsAmount={
                  localStorage.getItem("agesArray")
                    ? JSON.parse(localStorage.getItem("agesArray")).length
                    : 1
                }
                hotelServices={hotel.tourServices}
                hotel={hotel}
              />
            );
          })
      ) : (
        <div>😭 Ничего не найдено...</div>
      )}

      {tours?.length >= hotelsToShow ? (
        <button
          className="sort-btn"
          onClick={() => setHotelsToShow(hotelsToShow + 5)}
        >
          Загрузить еще
        </button>
      ) : null}
    </div>
  );
};

export default TourResults;
