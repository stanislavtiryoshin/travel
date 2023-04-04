import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../../components/HotelCard/HotelCard";
import { login, reset } from "../../features/auth/authSlice";
import {
  addHotel,
  getHotels,
  getAdminHotels,
  selectHotels,
} from "../../features/hotel/hotelSlice";
import { getOrders } from "../../features/order/orderSlice";

import "./Dashboard.scss";
import OrderRow from "./OrderRow";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Requests from "../Requests/Requests";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedHotels = useSelector(selectHotels);

  const [hotelData, setHotelData] = useState({
    name: "",
    location: "",
    resort: "",
    type: "",
    discount: 0,
    price: 0,
    food: "",
    description: "",
    rooms: [],
  });

  const { user } = useSelector((state) => state.auth);

  console.log(user);

  const { orders } = useSelector((state) => state.orders);

  const { hotels, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/");
    }

    dispatch(getAdminHotels("", "", ""));

    dispatch(getOrders());

    dispatch(reset());
  }, [user, getAdminHotels, isError, isSuccess, message, navigate, dispatch]);

  const handleAddHotel = (e) => {
    e.preventDefault();
    dispatch(addHotel(hotelData));
  };

  const [addedRooms, setAddedRooms] = useState(0);
  const [roomObj, setRoomObj] = useState({});

  const handleAddRoom = (e) => {
    e.preventDefault();
    let newHotelData = hotelData;
    newHotelData.rooms.push(roomObj);
    setHotelData(newHotelData);
    setRoomObj({});
  };

  const handleRoomInput = (e) => {
    e.preventDefault();
    setRoomObj({ ...roomObj, [e.target.name]: e.target.value });
  };

  const { currentTab } = useSelector((state) => state.admin);

  return (
    <div className="dashboard_page page">
      {currentTab === 1 && (
        <div className="hotels_tab tab">
          <HotelSearch hotelMode />

          <section className="dash_section">
            <div className="container">
              <div className="dash_wrapper wrapper">
                <div className="dash_side">
                  <Filter />
                </div>
                <div className="dash_main">
                  {selectedHotels && selectedHotels.length > 0
                    ? selectedHotels?.map((hotel, idx) => {
                        return <DashHotelCard hotel={hotel} />;
                      })
                    : "is loading"}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      {currentTab === 0 && (
        <div className="reqs_tab tab">
          <Requests />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
