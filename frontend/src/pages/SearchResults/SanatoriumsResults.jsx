import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import banner from "../../assets/banner.png";
import SortBtn from "../../components/Filter/SortBtn";
import HotelCard from "../../components/HotelCard/HotelCard";
import { useNavigate } from "react-router-dom";
import {
  getSanatoriums,
  getSearchedSanatoriums,
  selectSanatoriums,
  setFilterData as setSanatoriumFilterData,
} from "../../features/sanatorium/sanatoriumSlice";
import { useLazyGetSanatoriumsByFilterQuery } from "../../features/services/filter.service";

const SanatoriumResults = ({ mode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedSanatoriums = useSelector(selectSanatoriums);

  const [hotelsToShow, setHotelsToShow] = useState(5);
  const { sanatoriums, isError } = useSelector((state) => state.sanatoriums);
  const { startDate, endDate, peopleAmount, daysAmount, destination } =
    useSelector((state) => state.client);

  const [searchSanatoriums, { isLoading: hotelsIsLoading }] =
    useLazyGetSanatoriumsByFilterQuery();

  useEffect(() => {
    searchSanatoriums({
      locationId: "",
      agesArray: [1000],
      daysAmount: 1,
      start: startDate,
    }).then(({ data }) => {
      dispatch(setSanatoriumFilterData(data));
    });
  }, [searchSanatoriums]);

  return (
    <div className="all_hotels_wrapper wrapper ver">
      <img src={banner} alt="" className="banner" />

      <div className="all_hotels-top">
        <div className="all_hotels-num">
          Найдено: <span>{selectedSanatoriums?.length}</span>
        </div>
        <SortBtn mode={mode} />
      </div>

      {selectedSanatoriums && selectedSanatoriums.length > 0 ? (
        selectedSanatoriums
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

      {selectedSanatoriums?.length >= hotelsToShow ? (
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
