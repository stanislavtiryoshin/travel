import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { getAdminHotels, selectHotels } from "../../features/hotel/hotelSlice";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Section from "../../components/Section";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";
import { useLazyGetHotelsByFilterQuery } from "../../features/services/filter.service";

const HotelRes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchData } = useSelector((state) => state.search);
  const { hotels } = useSelector((state) => state.hotels);

  // console.log(startDate, "startdate");

  const [searchHotels, { isLoading: hotelsIsLoading }] =
    useLazyGetHotelsByFilterQuery();
  useEffect(() => {
    searchHotels(searchData).then(({ data }) => {
      dispatch(setHotelFilterData(data));
    });
  }, []);

  if (hotelsIsLoading) {
    return <Loader />;
  }

  console.log(hotels);

  return (
    <div className="hotels_tab tab">
      <HotelSearch mode="hotel" />
      <Section section="dash_section" wrapper="dash_wrapper">
        <div className="dash_side">
          <Filter hotelMode mode="hotel" />
        </div>
        <div className="dash_main">
          {hotels && hotels.length > 0
            ? hotels?.map((hotel, idx) => {
                return <DashHotelCard hotel={hotel} mode="hotel" />;
              })
            : "is loading"}
        </div>
      </Section>
    </div>
  );
};

export default HotelRes;
