import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import banner from "../../assets/banner.png";
import SortBtn from "../../components/Filter/SortBtn";
import HotelCard from "../../components/HotelCard/HotelCard";
import {
  getSearchedHotels,
  reset,
  selectHotels,
} from "../../features/hotel/hotelSlice";
import { useNavigate } from "react-router-dom";
import {
  getSanatoriums,
  getSearchedSanatoriums,
  selectSanatoriums,
} from "../../features/sanatorium/sanatoriumSlice";
import { useGetTourQuery } from "../../features/services/base.service";
import Loader from "../../components/Loader";

// import {setTour}

const TourResults = ({ mode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: tours = [], isLoading: LoadingTours } = useGetTourQuery();

  const [hotelsToShow, setHotelsToShow] = useState(5);
  const { sanatoriums, isError } = useSelector((state) => state.sanatoriums);
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
          Найдено: <span>{""}</span>
        </div>
        <SortBtn mode={mode} />
      </div>
      {tours && tours.length > 0 ? (
        tours
          .filter((hotel, idx) => idx < hotelsToShow)
          .map((hotel, idx) => {
            console.log(hotel, "tours");
            return (
              <HotelCard
                program={hotel.program}
                key={idx}
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
                // hotelServices={hotel.comforts
                //   .filter((comfort) => comfort.priority === 1)
                //   .map((comfort) => ({
                //     name: comfort.name,
                //     icon: comfort.icon,
                //   }))}
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