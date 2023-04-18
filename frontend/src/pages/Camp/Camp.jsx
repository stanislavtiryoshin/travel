import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { login, reset } from "../../features/auth/authSlice";
import {
  addHotel,
  getHotels,
  getSingleHotel,
} from "../../features/hotel/hotelSlice";
import RatingBox from "../../components/HotelCard/RatingBox";
import { addOrder } from "../../features/order/orderSlice";

import geo from "../../assets/geo.svg";
import map from "../../assets/map.svg";
import tag from "../../assets/tag.svg";
import clock from "../../assets/clock.svg";
import serv from "../../assets/serv.svg";
import check from "../../assets/check.svg";
import person from "../../assets/person.svg";
import calendar from "../../assets/calendar.svg";
import kids from "../../assets/kids.png";
import media from "../../assets/media.svg";
import media1 from "../../assets/media1.svg";
import media2 from "../../assets/media2.svg";
import ad from "../../assets/ad.png";

import hotel from "../../assets/hotel.png";
import "./../Hotel/Hotel.scss";
// import Room from "./Room";
import Excursions from "../../components/Excursions/Excursions";

import Card from "../../components/Card";
import Section from "../../components/Section";
import Room from "../Hotel/Room";
import Hotels from "../Home/Hotels";
import {
  useGetCampByIdQuery,
  useGetTourByTagMutation,
} from "../../features/services/edit.service";
import { useGetCampRecommendationsMutation } from "../../features/services/camp.service";

const Camp = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const [points, setPoints] = React.useState([]);
  const { campId } = useParams();
  // console.log(tourId);
  const { data: singleTour, isLoading, isError } = useGetCampByIdQuery(campId);

  const [roomCount, setRoomCount] = useState(3);

  const [recommendation, setRecommendation] = useState([]);
  const [getTour, { isLoading: recommendationIsLoading }] =
    useGetCampRecommendationsMutation();

  useEffect(() => {
    if (!isLoading)
      getTour({
        locationId: singleTour.locationId && singleTour.locationId._id,
      }).then(({ data }) => setRecommendation(data));
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const points =
        singleTour?.program &&
        singleTour?.program
          ?.map((item) =>
            item.days.length > 0 ? item.days.map((day) => day.points) : []
          )
          .reduce((prev, curr) => prev.concat(curr));

      const days = [...new Set(points.map((point) => point.day))];

      const result = days.map((day) => {
        const pointsForDay = points.filter((point) => point.day === day);
        const totalPoints = pointsForDay.length;
        return {
          day,
          points: pointsForDay,
          totalPoints,
        };
      });

      setPoints(result);
    }
  }, [singleTour]);

  const [programIdx, setProgramIdx] = useState(null);

  // console.log(points, "points");
  // const { data: roomsData, isLoading: roomIsLoading } =
  //   useGetRoomByHotelIdLimitQuery({
  //     tourId,
  //     limit: roomCount,
  //   });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // const [
  //   getData,
  //   {
  //     data: recommendation,
  //     isLoading: recommendationIsLoading,
  //     isSuccess: recommendationSuccess,
  //   },
  // ] = useGetHotelsByTagMutation();

  // useEffect(() => {
  //   getData({
  //     food: singleHotel && singleHotel.food && singleHotel.food._id,
  //     comforts: singleHotel && singleHotel.comforts && singleHotel.comforts,
  //   });
  // }, [singleHotel]);

  // useEffect(() => {
  //   if (isError) {
  //     console.log(message);
  //   }
  //   if (tourId) dispatch(getSingleHotel(tourId));
  //   dispatch(reset());
  // }, [tourId, isError, isSuccess, message, navigate, dispatch]);

  // const handleOrder = (e) => {
  //   e.preventDefault();
  //   dispatch(addOrder(orderTerms));
  // };

  // const [orderTerms, setOrderTerms] = useState({
  //   amount: 1,
  //   days: 2,
  //   startDate: null,
  //   endDate: null,
  //   name: "",
  //   room: "",
  //   sum: null,
  // });

  // const [clientData, setClientData] = useState({
  //   endDate: 0,
  //   startDate: 0,
  //   peopleAmount: 1,
  //   daysAmount: 2,
  // });

  // useEffect(() => {
  //   setClientData({
  //     ...clientData,
  //     startDate: window.localStorage.getItem("startDate"),
  //     endDate: window.localStorage.getItem("endDate"),
  //     peopleAmount: window.localStorage.getItem("peopleAmount"),
  //     daysAmount: window.localStorage.getItem("daysAmount"),
  //   });
  // }, []);

  // useEffect(() => {
  //   setOrderTerms({
  //     ...orderTerms,
  //     amount: clientData.peopleAmount,
  //     days: clientData.daysAmount,
  //     startDate: clientData.startDate,
  //     endDate: clientData.endDate,
  //   });
  // }, [clientData]);

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

  // const [clientStartingDate, setClientStartingDate] = useState(
  //   Date.parse(new Date())
  // );
  // const [clientEndingDate, setClientEndingDate] = useState(
  //   Date.parse(new Date(Date.now() + 3600 * 1000 * 24))
  // );

  // useEffect(() => {
  //   setClientStartingDate(new Date(+clientData.startDate));
  //   setClientEndingDate(new Date(+clientData.endDate));
  // }, [clientData.startDate, clientData.endDate]);

  // const [sum, setSum] = useState(0);

  // const { clientExcursions, clientRooms, excSum } = useSelector(
  //   (state) => state.client
  // );

  // useEffect(() => {
  //   window.localStorage.setItem("sum", sum);
  //   // if (clientRooms && clientRooms.length > 0)
  //   //   window.localStorage.setItem("rooms", JSON.stringify(clientRooms));
  //   if (singleTour) window.localStorage.setItem("tour", singleTour?._id);
  //   // if (clientExcursions)
  //   //   window.localStorage.setItem(
  //   //     "excursions",
  //   //     JSON.stringify(clientExcursions)
  //   //   );
  // }, [sum, singleTour]);

  // if (roomIsLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (recommendationIsLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div className="hotel_page page">
      <section className="hotel_section">
        <div className="hotel_container container">
          {singleTour ? (
            <div className="hotel_page_wrapper wrapper ">
              <div className="hotel_main_wrapper wrapper ver">
                <div className="hotel_page_top shadowed_box">
                  <div className="top_img-box">
                    <img src={hotel} alt="" className="hotel_img-main" />
                  </div>
                  <div className="top_content">
                    <div className="top_heading-row row">
                      <div className="hotel_name">{singleTour?.name}</div>
                      <RatingBox rating={singleTour?.rating} />
                    </div>
                    <div className="top_location-row row">
                      <div className="top_location-box">
                        <img src={geo} alt="" />
                        {singleTour?.locationId
                          ? singleTour?.locationId.locationName
                          : null}
                        ,{" "}
                        {singleTour?.locationId
                          ? singleTour?.locationId.locationCountry
                          : null}
                      </div>
                      <button className="top_location-btn primary-btn">
                        <img src={map} alt="" />
                        Посмотреть <br /> на карте
                      </button>
                    </div>
                    <div className="top_desc-row">
                      <div className="desc_title">Описание</div>
                      <div className="desc_box">{singleTour?.description}</div>
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
                  </div>
                  <div className="gen_info-row">
                    <div className="body_title-box">
                      <div className="body_title">Об туре</div>
                      <div className="body_title-text">
                        Расположение: {singleTour?.locationId?.locationName},{" "}
                        {singleTour?.locationId?.locationCountry}
                      </div>
                    </div>
                    {/* <div className="schedule-row row">
                      <div className="schedule-box">
                        <img src={clock} alt="" />
                        Заезд с {singleTour?.enterTime}
                      </div>
                      <div className="schedule-box">
                        <img src={clock} alt="" />
                        Выезд до {singleTour?.leaveTime}
                      </div>
                    </div> */}
                    <div className="desc-row">{singleTour?.description}</div>
                    <div className="food-row row">
                      <span>Типы питания:</span> все включено, без питания,
                      только завтрак
                    </div>
                  </div>
                  <div className="hotel_services-row">
                    <div className="body_title-box">
                      <div className="body_title">Услуги тура</div>
                    </div>
                    <div className="services_box">
                      <div className="services_col">
                        <div className="services_col-title">
                          <img src={serv} alt="" />
                          Питание
                        </div>
                        <ul className="services-list">
                          {singleTour &&
                            singleTour.food &&
                            singleTour?.food.map((foo) => <li>{foo.label}</li>)}
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
                  {points.map((point, idx) => (
                    <div className="hotel_services-row">
                      <div
                        onClick={() => {
                          setProgramIdx(idx);
                        }}
                        className="tour-program"
                      >
                        <div className="tour_day">{idx + 1} день</div>
                        <div className="tour_expand">V</div>
                      </div>
                      {programIdx === idx && (
                        <>
                          {point.points.map((info, infoIdx) => (
                            <div className="tour_info">
                              <div className="tour_info-time">{info.time}</div>
                              <div className="tour_info-title">
                                {info.pointName}
                              </div>
                              <div className="tour_info-desc">
                                {info.pointDescription}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ))}

                  {/* <div className="hotel_page-rooms">
                    <Hotels hotel={singleTour.hotelId} />
                  </div> */}
                  {/* <div className="hotel_page-rooms">
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
                  </div> */}
                  {/* <button
                    className="load-more-btn"
                    onClick={() => setRoomCount((prev) => prev + 1)}
                  >
                    Показать остальные
                  </button> */}
                </div>
              </div>

              <div className="hotel_side_wrapper wrapper ver">
                <div className="hotel_side-top shadowed_box">
                  <div className="hotel_side-title">Бронирование</div>
                  <div className="hotel_side-row">
                    {/* {clientStartingDate &&
                      clientStartingDate.toLocaleString(undefined, {
                        month: "numeric",
                        day: "numeric",
                      })}{" "}
                    -{" "} */}
                    {/* {clientEndingDate &&
                      clientEndingDate.toLocaleString(undefined, {
                        month: "numeric",
                        day: "numeric",
                      })} */}
                  </div>
                  {/* <div className="hotel_side-row">
                    <img src={person} alt="" /> {orderTerms?.amount} взр.
                  </div> */}
                  {/* <div className="hotel_side-row total">
                    Итого: <span>{sum} тг.</span>
                  </div> */}
                  {/* <Link
                    to="/orders/new-order"
                    className="primary-btn yellow"
                    onClick={handleOrder}
                  > */}
                  {/* Забронировать
                  </Link> */}
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

                {singleTour?.locationId?._id ? (
                  <Excursions locationId={singleTour?.locationId?._id} />
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
        <div className="hotel_similar-tour">Похожие лагеря</div>
        <div className="hotel_similar_text">
          Мы подобрали вам похожие лагеря. Взгляните, чтобы сравнить
        </div>
        <div className="hotel_similar-body">
          {recommendation?.map((recomm) => (
            <>
              {recomm._id !== singleTour._id && (
                <Card
                  id={recomm._id}
                  isTour
                  key={recomm._id}
                  name={recomm.name}
                  location={`${
                    recomm.locationId && recomm.locationId.locationName
                  }, ${recomm.locationId && recomm.locationId.locationCountry}`}
                  duration={recomm.duration}
                  image={
                    "https://www.state.gov/wp-content/uploads/2019/04/Kazakhstan-2426x1406.jpg"
                  }
                  // food={recomm.food[0] && recomm.food[0].label}
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

export default Camp;

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
