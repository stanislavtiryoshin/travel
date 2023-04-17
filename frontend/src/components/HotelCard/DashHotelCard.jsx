import React, { useState, useEffect } from "react";

import { RatingBox } from "./HotelCard";

import admhotel from "../../assets/admhotel.png";
import check2 from "../../assets/check2.svg";
import HotelStars from "../HotelStars/HotelStars";
import tag from "../../assets/tag.svg";
import { Link } from "react-router-dom";
import declOfNum from "../DayConfig";

const DashHotelCard = ({ hotel, tour, mode }) => {
  const { name, rating, stars, locationId, hotelStars, _id, extraPlaces } =
    hotel;

  const [tourDays, setTourDays] = useState(0);

  useEffect(() => {
    const uniqueDays = {};
    if (mode === "tour" && hotel) {
      hotel?.program.forEach((item) => {
        item.days.forEach((day) => {
          uniqueDays[day.points.day] = true;
        });
      });
    }
    setTourDays(Object.keys(uniqueDays).length);
  }, [mode]);
  return (
    <div className="adm_hotel-card shadowed_box">
      <div className="adm_hotels-content">
        <img src={admhotel} alt="" />
        <div className="adm_hotel-title">{name}</div>
        <div className="adm_hotel-loc">
          {locationId ? locationId?.locationName + ", " : "Место загружается"}
          {locationId ? locationId.locationCountry : null}
        </div>
        <div className="adm_hotel-rating row">
          {hotelStars ? <HotelStars number={hotelStars} /> : null}

          {rating ? <RatingBox rating={rating} /> : null}
          {extraPlaces ? (
            <div className="extra_place-box">
              <img src={check2} alt="" /> Доп. места
            </div>
          ) : null}
        </div>

        {mode === "hotel" ? (
          <div className="adm_hotel-feats">
            <div className="feats_col">
              <div className="feats_title">Номера</div>
              <div className="feats_row">1 мест.: 12</div>
              <div className="feats_row">2 мест.: 12</div>
              <div className="feats_row">4 мест.: 12</div>
            </div>
            <div className="feats_col">
              <div className="feats_title">Классы</div>
              <div className="feats_row">Стандарт: 4</div>
              <div className="feats_row">Делюкс: 12</div>
              <div className="feats_row">Люкс: 12</div>
            </div>
          </div>
        ) : null}
        <div className="card_mid-tags">
          {mode === "tour" ? (
            <div className="card_tag">
              <img src={tag} alt="" />
              {`${tourDays} ${declOfNum(tourDays)}`}
            </div>
          ) : (
            <div className="card_tag">
              <img src={tag} alt="" />
              Все включено
            </div>
          )}
          <div className="card_tag">
            <img src={tag} alt="" />
            Все включено
          </div>
          <div className="card_tag">
            <img src={tag} alt="" />
            Аниматоры
          </div>
          <div className="card_tag">
            <img src={tag} alt="" />
            Аниматоры
          </div>
          <div className="card_tag">
            <img src={tag} alt="" />
            Аниматоры
          </div>
        </div>
      </div>
      <div className="adm_hotel-btns">
        <Link to={`/dashboard/hotel/${_id}`} className="primary-btn clear">
          Редактировать
        </Link>
      </div>
    </div>
  );
};

export default DashHotelCard;
