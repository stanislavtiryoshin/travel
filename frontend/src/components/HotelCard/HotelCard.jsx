import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import RatingBox from "./RatingBox";

import "./HotelCard.scss";

import declOfNum from "../DayConfig";

import hotelimg from "../../assets/hotel.png";
import line from "../../assets/line.svg";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";
import tag from "../../assets/tag.svg";
import { useSelector } from "react-redux";
import HotelStars from "../HotelStars/HotelStars";

const HotelCard = ({
  hotelId,
  name,
  locationId,
  description,
  rating,
  totalPrice,
  oldPrice,
  rooms,
  hotelStars,
  mode,
  program,
  hotelServices,
  hotel,
}) => {
  const [cheapestRoom, setCheapestRoom] = useState();

  const [tourDays, setTourDays] = useState(0);

  useEffect(() => {
    const uniqueDays = {};
    if (mode === "tour") {
      program.forEach((item) => {
        item.days.forEach((day) => {
          uniqueDays[day.points.day] = true;
        });
      });
    }
    setTourDays(Object.keys(uniqueDays).length);
  }, [mode]);

  const { startDate, endDate, daysAmount, peopleAmount } = useSelector(
    (state) => state.client
  );

  // useEffect(() => {
  //   if (rooms && rooms.length > 0) {
  //     setCheapestRoom(
  //       rooms
  //         .filter((room) => room.capacity >= peopleAmount)
  //         .reduce(function (prev, current) {
  //           return prev.roomPrice < current.roomPrice ? prev : current;
  //         })
  //     );
  //   }
  // }, [rooms]);

  const [clientStartingDate, setClientStartingDate] = useState(new Date());
  const [clientEndingDate, setClientEndingDate] = useState(new Date());

  useEffect(() => {
    setClientStartingDate(new Date(+startDate));
    setClientEndingDate(new Date(+endDate));
  }, [startDate, endDate]);

  // const [sum, setSum] = useState(0);

  // const calculatePrice = (start, daysNum, basePrice) => {
  //   let daysArray = [];

  //   const pricesArray = cheapestRoom.prices;

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

  // useEffect(() => {
  //   if (clientData && cheapestRoom) {
  //     setSum(
  //       calculatePrice(clientStartingDate, daysAmount, cheapestRoom?.roomPrice)
  //     );
  //   }
  // }, [clientData, cheapestRoom, daysAmount]);

  return (
    <div className="hotel_card">
      <div className="card_left card_col">
        <img
          src={hotel?.img[0] ? hotel?.img[0] : hotelimg}
          alt=""
          className="hotel_card-img"
        />
        {cheapestRoom?.discount && cheapestRoom?.discount !== 0 ? (
          <div className="discount_box">-{cheapestRoom?.discount}%</div>
        ) : null}
      </div>
      <div className="card_mid card_col">
        <div className="card_mid-top">
          <div className="card_mid-title">{name}</div>
          <div className="card_mid-location">
            {locationId ? locationId.locationName + ", " : "Место загружается"}
            {locationId ? locationId.locationCountry : null}
          </div>
        </div>
        <div className="card_mid-rating">
          {hotelStars ? <HotelStars number={hotelStars} /> : null}
          {rating ? <RatingBox rating={rating} /> : null}
        </div>
        <div className="card_mid-desc">
          {description.slice(0, 100)}
          {description.length > 100 ? "..." : ""}
        </div>
        <div className="card_mid-tags">
          {mode === "tour" ? (
            <div className="card_tag">
              <img src={tag} alt="" />
              `${tourDays} ${declOfNum(tourDays)}`
            </div>
          ) : null}
          {hotelServices && hotelServices.length > 0
            ? hotelServices?.slice(0, 4).map((serv) => {
                return (
                  <div className="card_tag">
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
      <img src={line} alt="" />
      <div className="card_right card_col">
        <div className="card_right-top">
          {oldPrice ? (
            <>
              <div className="card_right-old-price">{oldPrice} тг</div>
              <div className="card_right-price">
                от <span>{totalPrice}</span> тг
              </div>
            </>
          ) : (
            <div className="card_right-price">
              от <span>{totalPrice}</span> тг
            </div>
          )}

          <div className="card_right-people">
            На {hotel.adultsAmount} взр.
            {hotel.kidsAmount && hotel.kidsAmount > 0
              ? `, ${hotel.kidsAmount} дет.`
              : null}
          </div>
        </div>
        <div className="card_right-days">
          <div className="card_days">
            <img src={sun} alt="" />
            <span>{hotel?.daysAmount}</span>
            дней
          </div>
          <div className="card_days nights">
            <img src={moon} alt="" />
            <span>{hotel?.nightsAmount}</span>
            ночи
          </div>
        </div>
        <Link
          className="primary-btn yellow"
          to={
            mode === "tour"
              ? `/tour/${hotelId}`
              : mode === "camps"
              ? `/camp/${hotelId}`
              : `/hotels/${hotelId}`
          }
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
