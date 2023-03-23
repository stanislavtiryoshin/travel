import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../../components/HotelCard/HotelCard";
import { login, reset } from "../../features/auth/authSlice";
import { addHotel, getHotels } from "../../features/hotel/hotelSlice";
import { getOrders } from "../../features/order/orderSlice";

import "./Dashboard.scss";
import OrderRow from "./OrderRow";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    dispatch(getHotels());
    dispatch(getOrders());

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleAddHotel = (e) => {
    e.preventDefault();
    dispatch(addHotel(hotelData));
    console.log(hotelData);
  };

  const [addedRooms, setAddedRooms] = useState(0);
  const [roomObj, setRoomObj] = useState({});

  const handleAddRoom = (e) => {
    e.preventDefault();
    let newHotelData = hotelData;
    newHotelData.rooms.push(roomObj);
    setHotelData(newHotelData);
    setRoomObj({});
    console.log(hotelData);
  };

  const handleRoomInput = (e) => {
    e.preventDefault();
    setRoomObj({ ...roomObj, [e.target.name]: e.target.value });
    console.log(roomObj);
  };

  return (
    <div className="dashboard_page page">
      <div className="dashobard_nav"></div>
      <section className="dash_hotels_section">
        <div className="container">
          <form
            action=""
            onSubmit={handleAddHotel}
            className="dash_hotels_wrapper wrapper ver"
          >
            <div className="all_hotels-top">
              <div className="all_hotels-num">Добавить новый отель:</div>
            </div>
            <input
              type="text"
              name="name"
              value={hotelData.name}
              required
              placeholder="Название отеля"
              onChange={(e) =>
                setHotelData({ ...hotelData, name: e.target.value })
              }
            />
            <input
              type="text"
              name="location"
              value={hotelData.location}
              required
              placeholder="Место"
              onChange={(e) =>
                setHotelData({ ...hotelData, location: e.target.value })
              }
            />
            <input
              type="text"
              name="resort"
              value={hotelData.resort}
              placeholder="Курорт"
              required
              onChange={(e) =>
                setHotelData({ ...hotelData, resort: e.target.value })
              }
            />
            <input
              type="text"
              name="type"
              value={hotelData.type}
              required
              placeholder="Тип"
              onChange={(e) =>
                setHotelData({ ...hotelData, type: e.target.value })
              }
            />
            <input
              type="number"
              name="discount"
              value={hotelData.discount}
              required
              placeholder="Скидка"
              onChange={(e) =>
                setHotelData({ ...hotelData, discount: e.target.value })
              }
            />
            <input
              type="number"
              name="price"
              value={hotelData.price}
              required
              placeholder="Цена"
              onChange={(e) =>
                setHotelData({ ...hotelData, price: e.target.value })
              }
            />
            <input
              type="text"
              name="food"
              value={hotelData.food}
              required
              placeholder="Питание"
              onChange={(e) =>
                setHotelData({ ...hotelData, food: e.target.value })
              }
            />
            <textarea
              name="description"
              placeholder="Описание"
              value={hotelData.description}
              required
              onChange={(e) =>
                setHotelData({ ...hotelData, description: e.target.value })
              }
            ></textarea>
            {hotelData.rooms.map((room, index) => {
              return (
                <div className="room_dash-box" key={index}>
                  {room.roomName}
                </div>
              );
            })}

            <input type="text" name="roomName" onChange={handleRoomInput} />
            <input type="number" name="capacity" onChange={handleRoomInput} />
            <input type="number" name="roomPrice" onChange={handleRoomInput} />

            <button type="submit" className="primary-btn">
              + Добавить
            </button>
          </form>
          <button onClick={handleAddRoom}>Добавить номер</button>
        </div>
      </section>
      <section className="all_orders_section">
        <div className="container">
          <div className="all_orders_wrapper wrapper ver">
            <div className="all_hotels-top">
              <div className="all_hotels-num">
                Всего заказов: <span>{orders.length}</span>
              </div>
              <button className="all_hotels-sort-btn">Сортировать</button>
            </div>
            {orders?.map((order, index) => {
              return (
                <OrderRow
                  key={index}
                  index={index}
                  name={order.name}
                  location={order.location}
                  price={order.price}
                  amount={order.amount}
                  startDate={order.startDate}
                  endDate={order.endDate}
                  sum={order.sum}
                  room={order.room}
                  days={order.days}
                  // status={order.status}
                />
              );
            })}
          </div>
        </div>
      </section>
      <section className="all_hotels_section">
        <div className="container">
          <div className="all_hotels_wrapper wrapper ver">
            <div className="all_hotels-top">
              <div className="all_hotels-num">
                Всего отелей: <span>{hotels.length}</span>
              </div>
              <button className="all_hotels-sort-btn">Сортировать</button>
            </div>
            {/* {hotels.map((hotel, id) => {
              return (
                <HotelCard
                  key={id}
                  name={hotel.name}
                  location={hotel.location}
                  price={hotel.price}
                  amount={1}
                  description={hotel.description}
                  rating={hotel.rating}
                />
              );
            })} */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
