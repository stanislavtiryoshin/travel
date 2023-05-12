import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { getSingleHotel, reset } from "../../features/hotel/hotelSlice";
import RatingBox from "../../components/HotelCard/RatingBox";

import geo from "../../assets/geo.svg";
import map from "../../assets/map.svg";
import clock from "../../assets/clock.svg";
import kids from "../../assets/kids.png";
import divider from "../../assets/hotel/divider.svg";

import "./Hotel.scss";
import Room from "./Room";
import Excursions from "../../components/Excursions/Excursions";
import {
  useGetHotelsByTagMutation,
  useGetRoomByHotelIdLimitQuery,
} from "../../features/services/base.service";
import GalleryBox from "../../components/Slider/GalleryBox";
import Recommendation from "../../components/Recommendation/Recommendation";
import HotelLoader from "../../components/Loader/HotelLoader";
import RoomLoader from "../../components/Loader/RoomLoader";
import RecommLoader from "../../components/Loader/RecommLoader";
import BodyTitle from "../../components/BodyTitle/BodyTitle";
import CheckBtn from "../../components/Filter/CheckBtn";
import { useGetHotelPriceQuery } from "../../features/services/price.service";

import { setRefetch } from "../../features/search/searchSlice";
import { addClientRoom } from "../../features/clientSlice";
import Services from "../../components/Services/Services";
import { ExpandableText } from "../../components/HotelPage/ExpandableText";
import Sum from "../../components/HotelPage/Sum";

const Hotel = () => {
  const dispatch = useDispatch();

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

  const { clientExcursions, clientRoom } = useSelector((state) => state.client);

  useEffect(() => {
    if (roomsData) {
      dispatch(addClientRoom(roomsData[0]));
    }
  }, [roomsData]);

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
    isFetching: priceIsFetching,
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
                  {singleHotel?.hotelServices ? (
                    <Services hotelServices={singleHotel?.hotelServices} />
                  ) : null}
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
                              <option
                                value={0}
                                selected={
                                  orderTerms.foodIncluded ? false : true
                                }
                              >
                                0
                              </option>
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
                              <option
                                value="0"
                                selected={
                                  orderTerms.foodIncluded ? false : true
                                }
                              >
                                0
                              </option>
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
                    {console.log(roomsData, "roomsData")}
                    {roomsData &&
                      roomsData.rooms.map((room) => {
                        return (
                          <Room
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

                  {roomsData.rooms.length === 0 ? (
                    <div>В данном отеле нет комнат</div>
                  ) : (
                    <>
                      {roomCount < roomsData.totalRooms && (
                        <div className="load-more-row">
                          <button
                            className="load-more-btn"
                            onClick={() => setRoomCount((prev) => prev + 100)}
                          >
                            Показать остальные
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="hotel_side_wrapper wrapper ver">
                <Sum
                  price={price}
                  priceData={priceData}
                  clientRoom={clientRoom}
                  priceIsLoading={priceIsFetching}
                  orderTerms={orderTerms}
                />

                {singleHotel?.locationId?._id ? (
                  <Excursions
                    locationId={singleHotel?.locationId?._id}
                    refetch={refetch}
                  />
                ) : (
                  "Экскурсии загружаются"
                )}

                <ExpandableText
                  locationName={singleHotel?.locationId?.locationName}
                  locationDescription={
                    singleHotel?.locationId?.locationDescription
                  }
                />

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

export default Hotel;
