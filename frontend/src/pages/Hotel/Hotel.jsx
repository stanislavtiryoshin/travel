import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

import HotelCard from "../../components/HotelCard/HotelCard";
import { login, reset } from "../../features/auth/authSlice";
import {
  addHotel,
  getHotels,
  getSingleHotel,
} from "../../features/hotel/hotelSlice";
import { getExcursions } from "../../features/excursion/excursionSlice";
import { RatingBox } from "../../components/HotelCard/HotelCard";
import { addOrder } from "../../features/order/orderSlice";

import Hero from "../../components/Hero/Hero";
import banner from "../../assets/banner.png";
import geo from "../../assets/geo.svg";
import map from "../../assets/map.svg";
import tag from "../../assets/tag.svg";
import clock from "../../assets/clock.svg";
import serv from "../../assets/serv.svg";
import check from "../../assets/check.svg";
import person from "../../assets/person.svg";
import kids from "../../assets/kids.png";
import media from "../../assets/media.svg";
import media1 from "../../assets/media1.svg";
import media2 from "../../assets/media2.svg";
import ad from "../../assets/ad.png";

import hotel from "../../assets/hotel.png";
import "./Hotel.scss";
import Room from "./Room";

const Hotel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hotelId } = useParams();
  const { singleHotel, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (singleHotel?.locationId)
      axios
        .get(`http://localhost:3000/api/locations/${singleHotel.locationId}`)
        .then((response) => {
          setLocation(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [singleHotel.locationId]);

  // const { excursions } = useSelector((state) => state.excursions);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (hotelId) dispatch(getSingleHotel(hotelId));
    // dispatch(getExcursions());
    dispatch(reset());
  }, [hotelId, isError, isSuccess, message, navigate, dispatch]);

  const handleOrder = (e) => {
    e.preventDefault();
    dispatch(addOrder(orderTerms));
  };

  const [orderTerms, setOrderTerms] = useState({
    amount: 1,
    days: 1,
    startDate: null,
    endDate: null,
    name: "",
    location: "",
    room: "",
    sum: null,
  });

  const [clientData, setClientData] = useState({
    endDate: 0,
    startDate: 0,
    peopleAmount: 1,
    daysAmount: 1,
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

  // useEffect(() => {

  // }, [])

  // useEffect(() => {
  //   setOrderTerms({
  //       ...orderTerms,
  //       amount: clientData.peopleAmount,
  //       days: clientData.daysAmount,
  //       startDate: clientData.startDate,
  //       endDate: clientData.endDate,
  //     }),
  // }, [clientData]);

  // console.log(orderTerms);

  const [clientRoom, setClientRoom] = useState("");
  const [clientRoomPrice, setClientRoomPrice] = useState();

  const chooseRoom = (chosenRoom, chosenRoomPrice) => {
    setClientRoom(chosenRoom);
    setClientRoomPrice(chosenRoomPrice);
    setOrderTerms({
      ...orderTerms,
      room: chosenRoom,
      sum: clientData?.daysAmount * chosenRoomPrice,
    });
  };

  useEffect(() => {
    if (singleHotel.rooms) {
      setClientRoom(
        singleHotel.rooms
          .filter((room) => room.capacity >= clientData.peopleAmount)
          .reduce(function (prev, current) {
            return prev.roomPrice < current.roomPrice ? prev : current;
          }).roomName
      );
    }
  }, [singleHotel.rooms]);

  const [currentRoom, setCurrentRoom] = useState();

  useEffect(() => {
    if (singleHotel?.rooms) {
      setCurrentRoom(
        singleHotel?.rooms?.filter((room) => room.roomName === clientRoom)[0]
          ?.prices
      );
    }
  }, [singleHotel.rooms]);

  console.log(clientData);

  const calculatePrice = (start, daysNum) => {
    let daysArray = [];

    const pricesArray = currentRoom;

    for (let i = 0; i < daysNum; i++) {
      let date = new Date();
      date.setDate(start.getDate() + i);
      daysArray.push(date);
    }

    let sum = 0;

    const findPriceByDate = (date) => {
      if (pricesArray && pricesArray.length >= 0) {
        pricesArray.forEach((el) => {
          // console.log(el.dateStart.month);
          if (
            date.getMonth() + 1 >= el.dateStart.month &&
            date.getMonth() + 1 <= el.dateEnd.month &&
            date.getDate() >= el.dateStart.day &&
            date.getDate() <= el.dateEnd.day
          ) {
            console.log(el.price);
            sum += el.price;
          } else {
            sum += 10000;
          }
          return;
        });
      }
    };

    for (let i = 0; i < daysNum; i++) {
      findPriceByDate(daysArray[i]);
    }

    return sum;
  };

  const [clientStartingDate, setClientStartingDate] = useState(new Date());
  const [clientEndingDate, setClientEndingDate] = useState(new Date());

  useEffect(() => {
    setClientStartingDate(new Date(+clientData.startDate));
    setClientEndingDate(new Date(+clientData.endDate));
  }, [clientData]);

  const [sum, setSum] = useState(0);

  useEffect(() => {
    setSum(calculatePrice(clientStartingDate, clientData.daysAmount));
  }, [calculatePrice]);

  return (
    <div className="hotel_page page">
      <section className="hotel_section">
        <div className="hotel_container container">
          {singleHotel ? (
            <div className="hotel_page_wrapper wrapper ">
              <div className="hotel_main_wrapper wrapper ver">
                <div className="hotel_page_top shadowed_box">
                  <div className="top_img-box">
                    <img src={hotel} alt="" className="hotel_img-main" />
                  </div>
                  <div className="top_content">
                    <div className="top_heading-row row">
                      <div className="hotel_name">{singleHotel?.name}</div>
                      <RatingBox rating={singleHotel?.rating} />
                    </div>
                    <div className="top_location-row row">
                      <div className="top_location-box">
                        <img src={geo} alt="" />
                        {location ? location.locationName : null},{" "}
                        {location ? location.locationCountry : null}
                      </div>
                      <button className="top_location-btn primary-btn">
                        <img src={map} alt="" />
                        Посмотреть <br /> на карте
                      </button>
                    </div>
                    <div className="top_desc-row">
                      <div className="desc_title">Описание</div>
                      <div className="desc_box">{singleHotel?.description}</div>
                      <a href="" className="hotel_anchor">
                        Подробнее
                      </a>
                    </div>
                    <div className="top_tags-row">
                      <div className="hotel_tag">
                        <img src={tag} alt="" />
                        Ресторан
                      </div>
                      <div className="hotel_tag">
                        <img src={tag} alt="" />
                        Ресторан
                      </div>
                      <div className="hotel_tag">
                        <img src={tag} alt="" />
                        Ресторан
                      </div>
                      <div className="hotel_tag">
                        <img src={tag} alt="" />
                        Ресторан
                      </div>
                      <div className="hotel_tag">
                        <img src={tag} alt="" />
                        Ресторан
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hotel_page-price shadowed_box">
                  <div className="body_title-box">
                    <div className="body_title">Цена</div>
                    <div className="body_title-text">
                      Выберите что хотите добавить в свой тур, чтобы рассчитать
                      стоимость и сравните периоды
                    </div>
                  </div>
                </div>
                <div className="hotel_page-gen shadowed_box">
                  <div className="gen_chosen-row">
                    <div className="body_title-box">
                      <div className="body_title">Ваш номер</div>
                      <div className="body_title-text">
                        Выбранный вами номер отображается здесь. Другие варианты
                        номеров и цены находятся{" "}
                        <a href="" className="hotel_anchor">
                          {" "}
                          здесь.{" "}
                        </a>
                      </div>
                    </div>
                    <div className="chosen_room-box">
                      {singleHotel.rooms &&
                        singleHotel.rooms
                          .filter((room) => room.roomName === clientRoom)
                          .map((room, index) => {
                            return (
                              <Room
                                key={index}
                                days={clientData?.daysAmount}
                                roomPrice={room.roomPrice}
                                roomName={room.roomName}
                                active="active"
                              />
                            );
                          })}
                    </div>
                  </div>
                  <div className="gen_info-row">
                    <div className="body_title-box">
                      <div className="body_title">Об отеле</div>
                      <div className="body_title-text">
                        Расположение: {singleHotel?.location}
                      </div>
                    </div>
                    <div className="schedule-row row">
                      <div className="schedule-box">
                        <img src={clock} alt="" />
                        Заезд с {singleHotel?.enterTime}
                      </div>
                      <div className="schedule-box">
                        <img src={clock} alt="" />
                        Выезд до {singleHotel?.leaveTime}
                      </div>
                    </div>
                    <div className="desc-row">{singleHotel?.description}</div>
                    <div className="food-row row">
                      <span>Типы питания:</span> все включено, без питания,
                      только завтрак
                    </div>
                  </div>
                  <div className="hotel_services-row">
                    <div className="body_title-box">
                      <div className="body_title">Услуги отеля</div>
                    </div>
                    <div className="services_box">
                      <div className="services_col">
                        <div className="services_col-title">
                          <img src={serv} alt="" />
                          Питание
                        </div>
                        <ul className="services-list">
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                        </ul>
                      </div>
                      <div className="services_col">
                        <div className="services_col-title">
                          <img src={serv} alt="" />
                          Питание
                        </div>
                        <ul className="services-list">
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                        </ul>
                      </div>
                      <div className="services_col">
                        <div className="services_col-title">
                          <img src={serv} alt="" />
                          Питание
                        </div>
                        <ul className="services-list">
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                          <li>главный ресторан</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="hotel_page-rooms">
                    <div className="body_title-box">
                      <div className="body_title">Варианты номеров</div>
                      <div className="body_title-text">
                        Выберите номер, который вам нравится и мы автоматически
                        рассчитаем цену в блоке “Бронирование”
                      </div>
                    </div>
                    {singleHotel.rooms &&
                      singleHotel?.rooms.map((room, index) => {
                        return (
                          <Room
                            key={index}
                            roomPrice={room.roomPrice}
                            roomName={room.roomName}
                            chooseRoom={chooseRoom}
                            days={clientData?.daysAmount}
                            active={clientRoom === room.roomName ? true : false}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="hotel_side_wrapper wrapper ver">
                <div className="hotel_side-top shadowed_box">
                  <div className="hotel_side-title">Бронирование</div>
                  <div className="hotel_side-row">
                    {clientStartingDate.toLocaleDateString()} -{" "}
                    {clientEndingDate.toLocaleDateString()}
                  </div>
                  <div className="hotel_side-row">
                    <img src={person} alt="" /> {orderTerms?.amount} взр.
                  </div>
                  <div className="hotel_side-row total">
                    Итого: <span>{sum} тг.</span>
                  </div>
                  <div className="primary-btn yellow" onClick={handleOrder}>
                    Забронировать
                  </div>
                  <div className="side-top-bot">
                    <img src={check} alt="" />У нас самые выгодные цены!
                  </div>
                </div>
                <div className="side_price-box shadowed_box small">
                  <div className="body_title-box">
                    <div className="body_title">Лучшая цена в Июле!</div>
                    <div className="body_title-text">
                      Lorem ipsum dolor sit amet, id dicant splendide cum.{" "}
                    </div>
                  </div>
                </div>
                <div className="side_exc-box shadowed_box small">
                  <div className="body_title-box">
                    <div className="body_title">
                      Дополните свой отдых яркими впечатлениями!
                    </div>
                    <div className="body_title-text">
                      Просто выберите экскурсию, которую хотели бы добавить с
                      свой тур и мы включим его в стоимость
                    </div>
                    {/* {excursions &&
                      excursions?.map((exc, index) => {
                        return (
                          <div className="exc_card">{exc.excursionName}</div>
                        );
                      })} */}
                  </div>
                </div>

                <ExpandableText text="Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum." />

                <div className="kids_box">
                  <img src={kids} alt="" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const truncatedText = text.slice(0, 200);
  const displayText = isExpanded ? text : truncatedText;

  return (
    <div className={`side_about-box shadowed_box small`}>
      <div className="body_title-box">
        <div className="body_title">Про Туркестан </div>
        <div className="body_title-text">
          {displayText}
          {!isExpanded ? "..." : ""}
        </div>
        <button className="more-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Свернуть" : "Больше"}
        </button>
      </div>
    </div>
  );
};

export default Hotel;
