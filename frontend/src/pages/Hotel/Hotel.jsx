import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { getSingleHotel, reset } from "../../features/hotel/hotelSlice";
import RatingBox from "../../components/HotelCard/RatingBox";
import { addOrder } from "../../features/order/orderSlice";

import geo from "../../assets/geo.svg";
import map from "../../assets/map.svg";
import tag from "../../assets/tag.svg";
import clock from "../../assets/clock.svg";
import serv from "../../assets/serv.svg";
import check from "../../assets/check.svg";
import person from "../../assets/person.svg";
import kids from "../../assets/kids.png";
import divider from "../../assets/hotel/divider.svg";

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
import GalleryBox from "../../components/Slider/GalleryBox";
import Recommendation from "../../components/Recommendation/Recommendation";
import HotelLoader from "../../components/Loader/HotelLoader";
import RoomLoader from "../../components/Loader/RoomLoader";
import RecommLoader from "../../components/Loader/RecommLoader";
import BodyTitle from "../../components/BodyTitle/BodyTitle";
import CheckBtn from "../../components/Filter/CheckBtn";
import { useGetHotelPriceQuery } from "../../features/services/price.service";
import Loader from "../../components/Loader";

import { setRefetch } from "../../features/search/searchSlice";
import { addClientRoom } from "../../features/clientSlice";

const Hotel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hotelId } = useParams();
  const { singleHotel, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const [sources, setSources] = useState([]);

  useEffect(() => {
    if (singleHotel.img) {
      setSources(singleHotel.img);
    } else {
      setSources([]);
    }
  }, [singleHotel]);

  const [roomCount, setRoomCount] = useState(3);

  const { data: roomsData, isLoading: roomIsLoading } =
    useGetRoomByHotelIdLimitQuery({
      hotelId,
      limit: roomCount,
      capacity: localStorage.getItem("agesArray")
        ? JSON.parse(localStorage.getItem("agesArray")).length
        : null,
    });

  const [
    getData,
    // {
    //   data: recommendation,
    //   isLoading: recommendationIsLoading,
    // },
  ] = useGetHotelsByTagMutation();

  const [recommendation, setRecommendation] = useState([]);

  useEffect(() => {
    getData({
      food: singleHotel && singleHotel.food && singleHotel.food._id,
      comforts: singleHotel && singleHotel.comforts && singleHotel.comforts,
      hotelServices:
        singleHotel && singleHotel.hotelServices && singleHotel.hotelServices,
    }).then((res) => setRecommendation(res.data));
  }, [singleHotel]);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getSingleHotel(hotelId));
    return () => {
      dispatch(reset());
    };
  }, [hotelId, dispatch]);

  const handleOrder = (e) => {
    e.preventDefault();
    const values = {
      ...orderTerms,
      room: clientRoom?._id,
    };
    dispatch(addOrder(values));
    navigate("/orders/new-order");
    console.log(values);
  };

  const [orderTerms, setOrderTerms] = useState({
    amount: 1,
    days: 2,
    startDate: null,
    endDate: null,
    name: "",
    room: "",
    sum: null,
    foodIncluded: false,
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

  const { clientExcursions, clientRoom, excSum } = useSelector(
    (state) => state.client
  );

  useEffect(() => {
    if (roomsData) {
      dispatch(addClientRoom(roomsData[0]));
    }
  }, [roomsData]);

  console.log(singleHotel, "singlehotel rooms");

  const [servicesToRender, setServicesToRender] = useState();

  useEffect(() => {
    const result = singleHotel?.hotelServices?.reduce((acc, cur) => {
      const category = cur.category.categoryName;
      const service = {
        _id: cur._id,
        hotelServiceName: cur.hotelServiceName,
      };

      if (!acc[category]) {
        acc[category] = {
          category,
          services: [service],
        };
      } else {
        acc[category].services.push(service);
      }

      return acc;
    }, {});

    const arrayResult = result ? Object.values(result) : [];

    if (singleHotel?.hotelServices) setServicesToRender(arrayResult);
  }, [singleHotel]);

  // const { clientRoom } = useSelector((state) => state.client);

  const [priceData, setPriceData] = useState({
    addRoomFood: false,
    addExtraFood: false,
    start: localStorage.getItem("startDate")
      ? JSON.parse(localStorage.getItem("startDate"))
      : "",
    daysAmount: localStorage.getItem("daysAmount")
      ? localStorage.getItem("daysAmount")
      : "",
    agesArray: [],
    hotelId,
    roomId: clientRoom?._id,
    personMode: false,
    excursionsArray: [],
    kidsFoodAmount: 0,
    adultsFoodAmount: 0,
  });

  const changeExtraFood = () => [
    setPriceData({ ...priceData, addExtraFood: !priceData.addExtraFood }),
  ];

  useEffect(() => {
    setPriceData((prev) => ({
      ...prev,
      roomId: clientRoom?._id,
    }));
  }, [clientRoom]);

  // const [ageA] = useState(
  //   localStorage.getItem("agesArray")
  //     ? JSON.parse(localStorage.getItem("agesArray"))
  //     : []
  // );

  useEffect(() => {
    const storedAgesArray = JSON.parse(localStorage.getItem("agesArray"));
    if (storedAgesArray) {
      setPriceData((prev) => ({
        ...prev,
        agesArray: storedAgesArray,
      }));
    }
  }, [localStorage.getItem("agesArray")]);

  useEffect(() => {
    setPriceData((prev) => ({
      ...prev,
      excursionsArray: localStorage.getItem("excursions")
        ? JSON.parse(localStorage.getItem("excursions"))
        : [],
    }));
  }, [localStorage.getItem("excursions")]);

  useEffect(() => {
    setPriceData((prev) => ({
      ...prev,
      daysAmount: localStorage.getItem("daysAmount")
        ? localStorage.getItem("daysAmount")
        : 1,
    }));
  }, [localStorage.getItem("daysAmount")]);

  useEffect(() => {
    setPriceData((prev) => ({
      ...prev,
      start: localStorage.getItem("startDate")
        ? JSON.parse(localStorage.getItem("startDate"))
        : Date.now(),
    }));
  }, [localStorage.getItem("startDate")]);

  const {
    data: price,
    isLoading: priceIsLoading,
    refetch,
  } = useGetHotelPriceQuery(priceData);

  useEffect(() => {
    window.localStorage.setItem("sum", price?.sum);
    if (clientRoom)
      window.localStorage.setItem("room", JSON.stringify(clientRoom));
    if (singleHotel) window.localStorage.setItem("hotel", singleHotel?._id);
    if (clientExcursions)
      window.localStorage.setItem(
        "excursions",
        JSON.stringify(clientExcursions)
      );
  }, [price, clientRoom, singleHotel, clientExcursions]);

  useEffect(() => {
    dispatch(setRefetch(refetch));
  }, [price]);

  useEffect(() => {
    if (!orderTerms.foodIncluded) {
      setPriceData((prev) => ({
        ...prev,
        adultsFoodAmount: 0,
        kidsFoodAmount: 0,
      }));
    }
  }, [orderTerms.foodIncluded]);

  const formatter = Intl.NumberFormat("ru-RU");

  if (isLoading) {
    return <HotelLoader />;
  }

  if (roomIsLoading) {
    return <RoomLoader />;
  }

  return (
    <div className="hotel_page page">
      <section className="hotel_section">
        <div className="hotel_container container">
          {singleHotel ? (
            <div className="hotel_page_wrapper wrapper ">
              <div className="hotel_main_wrapper wrapper ver">
                <div className="hotel_page_top shadowed_box">
                  <div className="hotel_img-box">
                    {sources ? <GalleryBox sources={sources} /> : null}
                  </div>
                  <div className="top_content">
                    <div className="top_heading-row row">
                      <div className="hotel_name">{singleHotel?.name}</div>
                      <RatingBox rating={singleHotel?.rating} starMode />
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
                      <a
                        className="top_location-btn primary-btn"
                        href={singleHotel.mapLink}
                      >
                        <img src={map} alt="" />
                        Посмотреть <br /> на карте
                      </a>
                    </div>
                    <div className="top_desc-row">
                      <div className="desc_title">Описание</div>
                      <div className="desc_box">
                        {singleHotel?.description?.slice(0, 200)}...
                      </div>
                      <a href="#anchor" className="hotel_anchor">
                        Подробнее
                      </a>
                    </div>
                    <div className="top_tags-row">
                      {singleHotel && singleHotel?.hotelServices
                        ? singleHotel?.hotelServices
                            ?.filter((serv) => serv.priority === 1)
                            .map((serv) => {
                              return (
                                <div className="hotel_tag" key={serv._id}>
                                  {serv.icon ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: serv.icon,
                                      }}
                                    />
                                  ) : null}
                                  {serv.hotelServiceName}
                                </div>
                              );
                            })
                        : null}
                    </div>
                  </div>
                </div>
                {/* <div className="hotel_page-price shadowed_box">
                  <BodyTitle
                    title="Цена"
                    text="Выберите что хотите добавить в свой тур, чтобы рассчитать
                      стоимость и сравните периоды"
                  />
                </div> */}
                <div className="hotel_page-gen shadowed_box">
                  {clientRoom?._id ? (
                    <>
                      <div className="hotel_page-rooms">
                        <div className="body_title-box">
                          <div className="body_title">Ваш номер</div>
                          <div className="body_title-text">
                            Выбранный вами номер отображается здесь. Другие
                            варианты номеров и цены находятся{" "}
                            <a href="#room_anchor" className="hotel_anchor">
                              здесь.
                            </a>
                          </div>
                          <div
                            className="body_title-text"
                            style={{ marginTop: "8px" }}
                          >
                            <font style={{ color: "rgba(233, 135, 21, 1)" }}>
                              Дети до 3-х лет проживают бесплатно без
                              предоставления места и питания.
                            </font>{" "}
                            <br />В каждом номере есть ограничение по размещению
                            младенцев.
                          </div>
                        </div>
                        <Room
                          key={clientRoom?._id}
                          room={clientRoom}
                          days={clientData?.daysAmount}
                          active={true}
                          changeExtraFood={changeExtraFood}
                          extraFoodActive={priceData.addExtraFood}
                          hasExtraPlaces={
                            clientRoom?.capacity <
                            JSON.parse(localStorage.getItem("agesArray")).length
                          }
                          extraPlaces={
                            JSON.parse(localStorage.getItem("agesArray"))
                              .length - clientRoom?.capacity
                          }
                        />
                      </div>
                      <img src={divider} alt="" />
                    </>
                  ) : null}
                  <div className="gen_info-row" id="anchor">
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
                  </div>
                  <img src={divider} alt="" />
                  <div className="hotel_services-row">
                    <div className="body_title-box">
                      <div className="body_title">Услуги отеля</div>
                    </div>
                    <div className="services_box">
                      {servicesToRender
                        ? servicesToRender.map((obj) => {
                            return (
                              <div className="services_col" key={obj._id}>
                                <div className="services_col-title">
                                  <img src={serv} alt="" />
                                  {obj.category}
                                </div>
                                <ul className="services_list">
                                  {obj?.services?.map((serv) => {
                                    return (
                                      <li key={serv._id}>
                                        {serv.hotelServiceName}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </div>
                  <img src={divider} alt="" />
                  <div className="hotel_food-row">
                    <div className="body_title-box">
                      <div className="body_title">
                        Питание{" "}
                        <div
                          className={`food_tag ${
                            singleHotel?.foodIncluded ? "incl" : "notincl"
                          }`}
                        >
                          {singleHotel?.foodIncluded
                            ? "Включено"
                            : "Не включено"}
                        </div>
                      </div>
                      <div className="body_title-text">
                        <span>
                          Наш отель предлагает гостям уютные номера и
                          великолепный сервис, включая 3-х разовое питание на
                          каждый день пребывания.
                        </span>
                        <span>
                          Мы заботимся о качестве и свежести нашей еды, чтобы
                          гости могли насладиться здоровым и вкусным питанием в
                          течение всего пребывания. Наш шеф-повар готовит блюда
                          из натуральных и свежих ингредиентов, а также
                          учитывает предпочтения и потребности каждого гостя.
                        </span>
                      </div>
                    </div>
                    <div className="food_box">
                      <div className="food_price-box">
                        <div className="food_prices">
                          {singleHotel?.adultFoodPrice ? (
                            <span>
                              Взрослый - {singleHotel?.adultFoodPrice}
                            </span>
                          ) : null}
                          {singleHotel?.kidFoodPrice ? (
                            <span>Детский - {singleHotel?.kidFoodPrice}</span>
                          ) : null}
                          {singleHotel?.babyFoodInfo ? (
                            <span>{singleHotel?.babyFoodInfo}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="food_price-form">
                        <div
                          className="filter_content"
                          onClick={() => {
                            setOrderTerms({
                              ...orderTerms,
                              foodIncluded: !orderTerms.foodIncluded,
                            });
                            setPriceData((prev) => ({
                              ...prev,
                              addRoomFood: !prev.addRoomFood,
                            }));
                          }}
                        >
                          <CheckBtn
                            isActive={orderTerms.foodIncluded ? true : false}
                          />
                          Добавить питание
                        </div>
                        <div className="input_row">
                          <div className="service-input">
                            <label htmlFor="">Кол-во детс.</label>
                            <select
                              name=""
                              id=""
                              disabled={priceData.addRoomFood ? false : true}
                              className="primary-input"
                              onChange={(e) => {
                                setPriceData((prev) => ({
                                  ...prev,
                                  kidsFoodAmount: Number(e.target.value),
                                }));
                              }}
                            >
                              {new Array(
                                JSON.parse(
                                  localStorage.getItem("agesArray")
                                ).filter((age) => age !== 1000).length
                              )
                                .fill(0)
                                .map((el, idx) => (
                                  <option value={idx + 1} key={idx}>
                                    {idx + 1}
                                  </option>
                                ))}

                              <option value={0} selected>
                                0
                              </option>
                            </select>
                          </div>

                          <div className="service-input">
                            <label htmlFor="">Кол-во взр.</label>
                            <select
                              name=""
                              id=""
                              className="primary-input"
                              disabled={priceData.addRoomFood ? false : true}
                              onChange={(e) => {
                                setPriceData((prev) => ({
                                  ...prev,
                                  adultsFoodAmount: Number(e.target.value),
                                }));
                              }}
                            >
                              {new Array(
                                JSON.parse(
                                  localStorage.getItem("agesArray")
                                ).filter((age) => age === 1000).length
                              )
                                .fill(0)
                                .map((el, idx) => (
                                  <option value={idx + 1} key={idx}>
                                    {idx + 1}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img src={divider} alt="" />
                  <div className="hotel_page-rooms" id="room_anchor">
                    <BodyTitle
                      title="Варианты номеров"
                      text="Выберите номер, который вам нравится и мы автоматически
                        рассчитаем цену в блоке “Бронирование”"
                    />
                    {roomsData &&
                      roomsData.map((room) => {
                        return (
                          <Room
                            // setRoomId={setPriceData}
                            key={room._id}
                            room={room}
                            active={clientRoom?._id === room._id}
                            changeExtraFood={changeExtraFood}
                            extraFoodActive={priceData.addExtraFood}
                            hasExtraPlaces={
                              room?.capacity <
                              JSON.parse(localStorage.getItem("agesArray"))
                                .length
                            }
                            extraPlaces={
                              JSON.parse(localStorage.getItem("agesArray"))
                                .length - room?.capacity
                            }
                          />
                        );
                      })}
                  </div>
                  {roomCount < 100 ? (
                    <div className="load-more-row">
                      <button
                        className="load-more-btn"
                        onClick={() => setRoomCount((prev) => prev + 100)}
                      >
                        Показать остальные
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="hotel_side_wrapper wrapper ver">
                <div className="hotel_side-top shadowed_box">
                  <div className="hotel_side-title">Бронирование</div>

                  <div>
                    {clientRoom?._id && (
                      <>
                        <div className="hotel_side-checksum">
                          <span>{clientRoom.roomName}</span>
                          <span className="price_span">
                            {formatter.format(price?.roomSum)} тг.
                          </span>
                        </div>
                        {price?.extraPlacesSum &&
                        price?.extraPlacesSum !== 0 ? (
                          <div className="hotel_side-extraPlace">
                            <span>
                              +{" "}
                              {JSON.parse(localStorage.getItem("agesArray"))
                                .length - clientRoom.capacity}{" "}
                              доп. места
                            </span>
                            <span className="price_span">
                              {price && formatter.format(price?.extraPlacesSum)}
                              тг
                            </span>
                          </div>
                        ) : null}
                        {priceData?.excursionsArray.length > 0 && (
                          <>
                            <div className="hotel_side-checksum">
                              <div>Экскурсия</div>
                              <span className="price_span">
                                {price &&
                                  formatter.format(price?.excursionsSum)}{" "}
                                тг.
                              </span>
                            </div>
                            <div className="hotel_side-extraPlace">
                              {JSON.parse(
                                localStorage.getItem("agesArray")
                              ).reduce((acc, current) => {
                                if (current === 1000) {
                                  return acc + 1;
                                }
                                return acc;
                              }, 0)}{" "}
                              взр.{" "}
                              {JSON.parse(
                                localStorage.getItem("agesArray")
                              ).reduce((acc, current) => {
                                if (current !== 1000) {
                                  return acc + 1;
                                }
                                return acc;
                              }, 0)}{" "}
                              дет.
                            </div>
                          </>
                        )}
                        {price?.margeSum && price?.margeSum !== 0 ? (
                          <>
                            <div className="hotel_side-checksum">
                              <div>Маржа</div>
                              <span className="price_span">
                                {price && formatter.format(price?.margeSum)} тг.
                              </span>
                            </div>
                            <div className="hotel_side-extraPlace">
                              <span>10 %</span>
                            </div>
                          </>
                        ) : null}
                      </>
                    )}
                  </div>

                  {/* <div className="hotel_side-row">
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
                  </div> */}
                  {/* <div className="hotel_side-row"> */}
                  {/* <img src={person} alt="" />{" "}
                    {JSON.parse(localStorage.getItem("agesArray")).length} взр. */}

                  {/* </div> */}
                  <div className="hotel_side-row total">
                    Итого:
                    {priceIsLoading ? (
                      <Loader />
                    ) : (
                      <div>
                        <span>
                          {price.sum ? formatter.format(price.sum) : "0"}
                          тг.
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/orders/new-order"
                    className="primary-btn yellow"
                    onClick={handleOrder}
                  >
                    Оставить заявку
                  </Link>
                  <div className="side-top-bot">
                    <div>
                      <img src={check} alt="" /> У нас самые выгодные цены!
                    </div>
                    <div>
                      <img src={check} alt="" /> Официальный турагент
                    </div>
                  </div>
                </div>
                {/* <div className="side_price-box shadowed_box small">
                  <div className="body_title-box">
                    <div className="body_title">Лучшая цена в Июле!</div>
                    <div className="body_title-text">
                      Lorem ipsum dolor sit amet, id dicant splendide cum.{" "}
                    </div>
                  </div>
                </div> */}

                {singleHotel?.locationId?._id ? (
                  <Excursions
                    locationId={singleHotel?.locationId?._id}
                    refetch={refetch}
                  />
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
      <Recommendation
        recommendation={recommendation}
        singleHotel={singleHotel}
      />
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
