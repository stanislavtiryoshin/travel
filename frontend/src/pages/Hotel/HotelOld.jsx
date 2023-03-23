import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../../components/HotelCard/HotelCard";
import { login, reset } from "../../features/auth/authSlice";
import {
  addHotel,
  getHotels,
  getSingleHotel,
} from "../../features/hotel/hotelSlice";
import Hero from "../../components/Hero/Hero";
import banner from "../../assets/banner.png";
import { useParams } from "react-router-dom";
import hotel from "../../assets/hotel.png";
import { useLocation } from "react-router-dom";
import "./Hotel.scss";
import Room from "./Room";
import { addOrder } from "../../features/order/orderSlice";

const Hotel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentHotel, setCurrentHotel] = useState({});
  const { hotels, singleHotel, isLoading, isSuccess, isError, message } =
    useSelector((state) => state.hotels);
  const { hotelId } = useParams();

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getSingleHotel({ hotelId: hotelId }));
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  useEffect(() => {
    setCurrentHotel(singleHotel);
  }, [hotelId]);

  console.log(currentHotel);

  const [clientData, setClientData] = useState({
    endDate: 0,
    startDate: 0,
    peopleAmount: 0,
    daysAmount: 0,
  });

  useEffect(() => {
    setClientData({
      ...clientData,
      startDate: window.localStorage.getItem("startDate"),
      endDate: window.localStorage.getItem("endDate"),
      peopleAmount: window.localStorage.getItem("peopleAmount"),
      daysAmount: window.localStorage.getItem("daysAmount"),
    });
  }, []);

  const location = useLocation();
  // const { amount, days, startDate, endDate } = location.state;

  const [orderTerms, setOrderTerms] = useState({
    // amount: amount,
    // days: days,
    // startDate: startDate,
    // endDate: endDate,
    name: "",
    location: "",
    room: "",
    sum: null,
  });

  useEffect(() => {
    setOrderTerms({
      ...orderTerms,
      name: currentHotel.name,
      location: currentHotel.location,
    });
  }, [currentHotel]);

  const [clientRoom, setClientRoom] = useState("");
  const [clientRoomPrice, setClientRoomPrice] = useState();

  const chooseRoom = (chosenRoom, chosenRoomPrice) => {
    setClientRoom(chosenRoom);
    setClientRoomPrice(chosenRoomPrice);
    // setOrderTerms({
    //   ...orderTerms,
    //   room: chosenRoom,
    //   sum: days * chosenRoomPrice,
    // });
  };

  // console.log(orderTerms);

  const handleOrder = (e) => {
    e.preventDefault();
    dispatch(addOrder(orderTerms));
    console.log(orderTerms);
  };

  return (
    <div className="hotel_page page">
      <section className="hotel_section">
        {currentHotel ? (
          <div className="hotel_page_wrapper wrapper">
            <div className="container hotel_main_container">
              <div className="hotel_wrapper wrapper ver">
                <div className="body_title">Отель</div>

                <div className="hotel_page_top">
                  <img src={hotel} alt="" />
                  <div className="top_content">
                    <div className="top_rating">
                      {currentHotel?.rating === 0
                        ? "Пока нет отзывов"
                        : `${currentHotel}/5`}
                    </div>
                    <div className="top_name">{currentHotel?.name}</div>
                    <div className="top_location">{currentHotel?.location}</div>
                    <div className="top_desc">{currentHotel?.description}</div>
                  </div>
                </div>
                <div className="hotel_page-rooms">
                  <div className="body_title">Варианты номеров</div>
                  {currentHotel.rooms.map((room, index) => {
                    return (
                      <Room
                        key={index}
                        roomPrice={room.roomPrice}
                        roomName={room.roomName}
                        chooseRoom={chooseRoom}
                        active={clientRoom === room.roomName ? true : false}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="hotel_side_container container">
              <div className="hotel_side_wrapper wrapper ver">
                <div className="hotel_side-box">
                  <div className="hotel_side-title">Бронирование</div>
                  {/* <div className="hotel_side-row">
                    {startDate} - {endDate}
                  </div> */}
                  {/* <div className="hotel_side-row">{amount} взр.</div> */}
                  <div className="hotel_side-row total">
                    Итого: <span>{orderTerms.sum} тг.</span>
                  </div>
                  <div className="primary-btn yellow" onClick={handleOrder}>
                    Забронировать
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Hotel;
