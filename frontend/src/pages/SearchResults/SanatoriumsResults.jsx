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
} from "../../features/sanatorium/sanatoriumSlice";

const SanatoriumResults = ({ mode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hotelsToShow, setHotelsToShow] = useState(5);
  const { sanatoriums, isError } = useSelector((state) => state.sanatoriums);
  const { startDate, endDate, peopleAmount, daysAmount, destination } =
    useSelector((state) => state.client);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(
      getSearchedSanatoriums({
        locationId: "",
        peopleAmount: 1,
        daysAmount: 2,
        startDate: Date.parse(new Date()),
        adultsAmount: 1,
        kidsAmount: 0,
      })
    );
    dispatch(reset());
  }, [dispatch]);

  return (
    <div className="all_hotels_wrapper wrapper ver">
      <img src={banner} alt="" className="banner" />

      <div className="all_hotels-top">
        <div className="all_hotels-num">
          Найдено: <span>{sanatoriums?.length}</span>
        </div>
        <SortBtn mode={mode} />
      </div>

      {sanatoriums && sanatoriums.length > 0 ? (
        sanatoriums
          .filter((hotel, idx) => idx < hotelsToShow)
          .map((hotel, idx) => {
            return (
              <HotelCard
                program={hotel.program}
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
                mode="sanatorium"
                hotelServices={hotel?.sanatoriumServices?.map(
                  (serv) => serv.serviceType
                )}
                hotel={hotel}
              />
            );
          })
      ) : (
        <div>😭 Ничего не найдено...</div>
      )}

      {sanatoriums.length >= hotelsToShow ? (
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

export default SanatoriumResults;