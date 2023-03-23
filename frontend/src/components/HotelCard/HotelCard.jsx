import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./HotelCard.scss";

import hotel from "../../assets/hotel.png";
import line from "../../assets/line.svg";
import star from "../../assets/star.svg";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";
import tag from "../../assets/tag.svg";

const HotelCard = ({
  hotelId,
  name,
  locationId,
  description,
  rating,
  amount,
  days,
  startDate,
  endDate,
  rooms,
}) => {
  const [cheapestRoom, setCheapestRoom] = useState();

  useEffect(() => {
    if (rooms) {
      setCheapestRoom(
        rooms
          .filter((room) => room.capacity >= amount)
          .reduce(function (prev, current) {
            return prev.roomPrice < current.roomPrice ? prev : current;
          })
      );
    }
  }, [rooms]);

  return (
    <div className="hotel_card">
      <div className="card_left card_col">
        <img src={hotel} alt="" className="hotel_card-img" />
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
          <div className="rating-stars">
            <img src={star} alt="" />
            <img src={star} alt="" />
            <img src={star} alt="" />
            <img src={star} alt="" />
            <img src={star} alt="" />
          </div>
          <RatingBox rating={rating} />
        </div>
        <div className="card_mid-desc">{description}</div>
        <div className="card_mid-tags">
          <div className="card_tag">
            <img src={tag} alt="" />
            Все включено
          </div>
          <div className="card_tag">
            <img src={tag} alt="" />
            Все включено
          </div>
        </div>
      </div>
      <img src={line} alt="" />
      <div className="card_right card_col">
        <div className="card_right-top">
          {cheapestRoom?.discount ? (
            <div className="card_right-old-price">
              {cheapestRoom?.roomPrice * days} тг
            </div>
          ) : null}
          <div className="card_right-price">
            от{" "}
            <span>
              {cheapestRoom?.discount
                ? (cheapestRoom?.roomPrice / 100) *
                  (100 - cheapestRoom?.discount) *
                  days
                : cheapestRoom?.roomPrice * days}
            </span>{" "}
            тг
          </div>
          <div className="card_right-people">На {amount} взр.</div>
        </div>
        <div className="card_right-days">
          <div className="card_days">
            <img src={sun} alt="" />
            <span>{days}</span>
            дней
          </div>
          <div className="card_days nights">
            <img src={moon} alt="" />
            <span>{days - 1}</span>
            ночи
          </div>
        </div>
        <Link className="primary-btn yellow" to={`/hotels/${hotelId}`}>
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export const RatingBox = ({ rating }) => {
  return <div className="rating-num">Рейтинг {rating}</div>;
};

export default HotelCard;
