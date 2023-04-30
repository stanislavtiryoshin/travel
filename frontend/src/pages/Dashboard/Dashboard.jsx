import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../../components/HotelCard/HotelCard";
import { login, reset } from "../../features/auth/authSlice";
import { getAdminHotels, selectHotels } from "../../features/hotel/hotelSlice";
import { getOrders } from "../../features/order/orderSlice";
import Section from "../../components/Section";

import "./Dashboard.scss";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Requests from "../Requests/Requests";
import { getTours } from "../../features/tour/tourSlice";
import { getCamps } from "../../features/camps/campSlice";
import { getSanatoriums } from "../../features/sanatorium/sanatoriumSlice";
import Manager from "../Manager/Manager";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedHotels = useSelector(selectHotels);
  // const selectedTours = useSelector(selectTours);

  const { user } = useSelector((state) => state.auth);

  const { orders } = useSelector((state) => state.orders);

  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const { tours } = useSelector((state) => state.tour);
  const { camps } = useSelector((state) => state.camps);
  const { sanatoriums } = useSelector((state) => state.sanatoriums);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (!user) {
      navigate("/");
    }
    dispatch(getAdminHotels("", "", ""));
    dispatch(getTours());
    dispatch(getCamps());
    dispatch(getOrders());
    dispatch(getSanatoriums());
    dispatch(reset());
  }, [user, getAdminHotels, isError, isSuccess, message, navigate, dispatch]);

  const { currentTab } = useSelector((state) => state.admin);

  return (
    <div className="dashboard_page page">
      {currentTab === 1 && (
        <div className="hotels_tab tab">
          <HotelSearch hotelMode />
          <Section section="dash_section" wrapper="dash_wrapper">
            <div className="dash_side">
              <Filter hotelMode />
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
      )}
      {currentTab === 0 && (
        <div className="reqs_tab tab">
          <Requests />
        </div>
      )}
      {currentTab === 5 && (
        <div className="reqs_tab tab">
          <Manager hotelMode />
        </div>
      )}
      {currentTab === 2 && (
        <div className="tours_tab tab">
          <HotelSearch tourMode />
          <Section section="dash_section" wrapper="dash_wrapper">
            <div className="dash_side">
              <Filter tourMode />
            </div>
            <div className="dash_main">
              {tours && tours.length > 0
                ? tours?.map((tour, idx) => {
                    return (
                      <DashHotelCard hotel={tour} key={tour._id} mode="tour" />
                    );
                  })
                : "is loading"}
            </div>
          </Section>
        </div>
      )}
      {currentTab === 3 && (
        <div className="tours_tab tab">
          <HotelSearch campMode />
          <Section section="dash_section" wrapper="dash_wrapper">
            <div className="dash_side">
              <Filter campMode />
            </div>
            <div className="dash_main">
              {camps && camps.length > 0
                ? camps?.map((camp, idx) => {
                    return (
                      <DashHotelCard hotel={camp} key={camp._id} mode="camp" />
                    );
                  })
                : "is loading"}
            </div>
          </Section>
        </div>
      )}
      {currentTab === 4 && (
        <div className="tours_tab tab">
          <HotelSearch sanMode />
          <Section section="dash_section" wrapper="dash_wrapper">
            <div className="dash_side">
              <Filter sanMode />
            </div>
            <div className="dash_main">
              {sanatoriums && sanatoriums.length > 0
                ? sanatoriums?.map((sanatorium, idx) => {
                    return (
                      <DashHotelCard
                        hotel={sanatorium}
                        key={sanatorium._id}
                        mode="sanatorium"
                      />
                    );
                  })
                : "is loading"}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
