import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { getSingleHotel } from "../../features/hotel/hotelSlice";
import { RatingBox } from "../../components/HotelCard/HotelCard";
import { addOrder } from "../../features/order/orderSlice";

import geo from "../../assets/geo.svg";
import map from "../../assets/map.svg";
import tag from "../../assets/tag.svg";
import clock from "../../assets/clock.svg";
import serv from "../../assets/serv.svg";
import check from "../../assets/check.svg";
import person from "../../assets/person.svg";
import kids from "../../assets/kids.png";

import hotel from "../../assets/hotel.png";
import "./Hotel.scss";
import Room from "./Room";
import Excursions from "../../components/Excursions/Excursions";
import {
  useGetHotelsByTagMutation,
  useGetRoomByHotelIdLimitQuery,
} from "../../features/services/base.service";
import Card from "../../components/Card";
import Section from "../../components/Section";

const Hotel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hotelId } = useParams();
  const { singleHotel, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const [roomCount, setRoomCount] = useState(3);

  const { data: roomsData, isLoading: roomIsLoading } =
    useGetRoomByHotelIdLimitQuery({
      hotelId,
      limit: roomCount,
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const [
    getData,
    {
      data: recommendation,
      isLoading: recommendationIsLoading,
      isSuccess: recommendationSuccess,
    },
  ] = useGetHotelsByTagMutation();

  useEffect(() => {
    getData({
      food: singleHotel && singleHotel.food && singleHotel.food._id,
      comforts: singleHotel && singleHotel.comforts && singleHotel.comforts,
      hotelServices:
        singleHotel && singleHotel.hotelServices && singleHotel.hotelServices,
    });
  }, [singleHotel]);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (hotelId) dispatch(getSingleHotel(hotelId));
  }, [hotelId, isError, isSuccess, message, navigate, dispatch]);

  const handleOrder = (e) => {
    e.preventDefault();
    dispatch(addOrder(orderTerms));
  };

  const [orderTerms, setOrderTerms] = useState({
    amount: 1,
    days: 2,
    startDate: null,
    endDate: null,
    name: "",
    room: "",
    sum: null,
  });

  const [clientData, setClientData] = useState({
    endDate: 0,
    startDate: 0,
    peopleAmount: 1,
    daysAmount: 2,
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

  useEffect(() => {
    setOrderTerms({
      ...orderTerms,
      amount: clientData.peopleAmount,
      days: clientData.daysAmount,
      startDate: clientData.startDate,
      endDate: clientData.endDate,
    });
  }, [clientData]);

  // useEffect(() => {
  //   if (singleHotel?.rooms && singleHotel?.rooms.length > 0) {
  //     setClientRoom(
  //       singleHotel?.rooms
  //         // .filter((room) => room.capacity >= clientData.peopleAmount)
  //         ?.reduce(function (prev, current) {
  //           return prev.roomPrice < current.roomPrice ? prev : current;
  //         })
  //     );
  //   }
  // }, [singleHotel.rooms]);

  const [clientStartingDate, setClientStartingDate] = useState(
    Date.parse(new Date())
  );
  const [clientEndingDate, setClientEndingDate] = useState(
    Date.parse(new Date(Date.now() + 3600 * 1000 * 24))
  );

  useEffect(() => {
    setClientStartingDate(new Date(+clientData.startDate));
    setClientEndingDate(new Date(+clientData.endDate));
  }, [clientData.startDate, clientData.endDate]);

  const [sum, setSum] = useState(0);

  const { clientExcursions, clientRooms, excSum } = useSelector(
    (state) => state.client
  );

  useEffect(() => {
    window.localStorage.setItem("sum", sum);
    if (clientRooms && clientRooms.length > 0)
      window.localStorage.setItem("rooms", JSON.stringify(clientRooms));
    if (singleHotel) window.localStorage.setItem("hotel", singleHotel?._id);
    if (clientExcursions)
      window.localStorage.setItem(
        "excursions",
        JSON.stringify(clientExcursions)
      );
  }, [sum, clientRooms, singleHotel, clientExcursions]);

  if (roomIsLoading) {
    return <div>Loading...</div>;
  }

  if (recommendationIsLoading) {
    return <div>Loading...</div>;
  }
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
                        {singleHotel?.locationId
                          ? singleHotel?.locationId.locationName
                          : null}
                        ,{" "}
                        {singleHotel?.locationId
                          ? singleHotel?.locationId.locationCountry
                          : null}
                      </div>
                      <button className="top_location-btn primary-btn">
                        <img src={map} alt="" />
                        Посмотреть <br /> на карте
                      </button>
                    </div>
                    <div className="top_desc-row">
                      <div className="desc_title">Описание</div>
                      <div className="desc_box">{singleHotel?.description}</div>
                      <a href="#anchor" className="hotel_anchor">
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
                      <div className="body_title" id="anchor">
                        Ваш номер
                      </div>
                      <div className="body_title-text">
                        Выбранный вами номер отображается здесь. Другие варианты
                        номеров и цены находятся{" "}
                        <a href="" className="hotel_anchor">
                          здесь.
                        </a>
                      </div>
                    </div>
                    <div className="chosen_room-box">
                      {clientRooms &&
                        clientRooms?.map((room) => {
                          <Room
                            key={room._id}
                            room={room}
                            days={clientData?.daysAmount}
                            active={true}
                          />;
                        })}
                    </div>
                  </div>
                  <div className="gen_info-row">
                    <div className="body_title-box">
                      <div className="body_title">Об отеле</div>
                      <div className="body_title-text">
                        Расположение: {singleHotel?.locationId?.locationName},{" "}
                        {singleHotel?.locationId?.locationCountry}
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

                    {roomsData &&
                      roomsData.map((room) => {
                        return (
                          <Room
                            key={room._id}
                            room={room}
                            active={clientRooms.some(
                              (clientRoom) => clientRoom._id === room._id
                            )}
                          />
                        );
                      })}
                  </div>
                  {roomCount < 100 ? (
                    <button
                      className="load-more-btn"
                      onClick={() => setRoomCount((prev) => prev + 100)}
                    >
                      Показать остальные
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="hotel_side_wrapper wrapper ver">
                <div className="hotel_side-top shadowed_box">
                  <div className="hotel_side-title">Бронирование</div>
                  <div className="hotel_side-row">
                    {clientStartingDate &&
                      clientStartingDate.toLocaleString(undefined, {
                        month: "numeric",
                        day: "numeric",
                      })}{" "}
                    -{" "}
                    {clientEndingDate &&
                      clientEndingDate.toLocaleString(undefined, {
                        month: "numeric",
                        day: "numeric",
                      })}
                  </div>
                  <div className="hotel_side-row">
                    <img src={person} alt="" /> {orderTerms?.amount} взр.
                  </div>
                  <div className="hotel_side-row total">
                    Итого: <span>{sum} тг.</span>
                  </div>
                  <Link
                    to="/orders/new-order"
                    className="primary-btn yellow"
                    onClick={handleOrder}
                  >
                    Забронировать
                  </Link>
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

                {singleHotel?.locationId?._id ? (
                  <Excursions locationId={singleHotel?.locationId?._id} />
                ) : (
                  "Экскурсии загружаются"
                )}

                <ExpandableText text="Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum. Lorem ipsum dolor sit amet, id dicant splendide cum." />

                <div className="kids_box">
                  <img src={kids} alt="" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <Section section="similar_section" wrapper="hotel_similar-wrapper ver">
        <div className="hotel_similar-tour">Похожие отели</div>
        <div className="hotel_similar_text">
          Мы подобрали вам похожие туры. Взгляните, чтобы сравнить
        </div>
        {/* {console.log(recommendation)} */}
        <div className="hotel_similar-body">
          {recommendation?.map((recomm) => (
            <>
              {recomm._id !== singleHotel._id && (
                <Card
                  isHotel
                  id={recomm._id}
                  key={recomm._id}
                  location={`${
                    recomm.locationId && recomm.locationId.locationName
                  }, ${recomm.locationId && recomm.locationId.locationCountry}`}
                  name={recomm.name}
                  stars={recomm.hotelStars}
                  food={recomm.food && recomm.food.value}
                  duration={`${recomm.enterTime} - ${recomm.leaveTime}`}
                  image={
                    "https://www.state.gov/wp-content/uploads/2019/04/Kazakhstan-2426x1406.jpg"
                  }
                />
              )}
            </>
          ))}
        </div>
      </Section>
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

// const calculatePrice = (start, daysNum, basePrice) => {
//   let daysArray = [];

//   const pricesArray = clientRoom.prices;

//   for (let i = 0; i < daysNum; i++) {
//     let date = new Date();
//     date.setDate(start.getDate() + i);
//     daysArray.push(date);
//   }

//   let sum = 0;

//   const findPriceByDate = (date) => {
//     if (pricesArray && pricesArray.length > 0) {
//       pricesArray.forEach((el) => {
//         if (
//           date.getMonth() + 1 >= el.dateStart.month &&
//           date.getMonth() + 1 <= el.dateEnd.month &&
//           date.getDate() >= el.dateStart.day &&
//           date.getDate() <= el.dateEnd.day &&
//           el.price
//         ) {
//           sum += el.price;
//         } else {
//           sum += basePrice;
//         }
//       });
//     } else {
//       sum += basePrice;
//     }
//     return;
//   };

//   for (let i = 0; i < daysNum; i++) {
//     findPriceByDate(daysArray[i]);
//   }

//   return sum;
// };

// useEffect(() => {
//   if (clientData && clientRoom) {
//     if (clientRoom?.discount) {
//       setSum(
//         (calculatePrice(
//           clientStartingDate,
//           clientData?.daysAmount,
//           clientRoom?.roomPrice
//         ) *
//           (100 - clientRoom?.discount)) /
//           100 +
//           excSum
//       );
//     } else {
//       setSum(
//         calculatePrice(
//           clientStartingDate,
//           clientData?.daysAmount,
//           clientRoom?.roomPrice
//         ) + excSum
//       );
//     }
//     window.localStorage.setItem("sum", sum);
//   }
// }, [clientRoom, excSum]);

/* {singleHotel.rooms &&
      clientRoom &&
      singleHotel?.rooms
        ?.filter(
          (room) => room.capacity >= clientData.peopleAmount
        )
        .map((room, index) => {
          return (
            <Room
              key={room._id}
              room={room}
              chooseRoom={chooseRoom}
              days={clientData?.daysAmount}
              active={
                clientRoom?._id === room._id ? true : false
              }
            />
          );
        })} */
