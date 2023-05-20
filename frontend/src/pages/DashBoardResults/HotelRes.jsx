import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { getAdminHotels, selectHotels } from "../../features/hotel/hotelSlice";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Section from "../../components/Section";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";

const HotelRes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );
  const selectedHotels = useSelector(selectHotels);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    dispatch(getAdminHotels("", "", ""));
  }, [getAdminHotels, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="hotels_tab tab">
      <HotelSearch mode="hotel" />
      <Section section="dash_section" wrapper="dash_wrapper">
        <div className="dash_side">
          <Filter hotelMode mode="hotel" />
        </div>
        <div className="dash_main">
          {selectedHotels && selectedHotels.length > 0
            ? selectedHotels?.map((hotel, idx) => {
                return <DashHotelCard hotel={hotel} mode="hotel" />;
              })
            : "is loading"}
        </div>
      </Section>
    </div>
  );
};

export default HotelRes;
