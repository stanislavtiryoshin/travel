import React from "react";

import { RatingBox } from "./HotelCard";

import admhotel from "../../assets/admhotel.png";
import check2 from "../../assets/check2.svg";
import HotelStars from "../HotelStars/HotelStars";
import tag from "../../assets/tag.svg";
import { Link } from "react-router-dom";

const DashHotelCard = ({ hotel }) => {
  const { name, rating, stars, locationId, hotelStars, _id } = hotel;
  return (
    <div className="adm_hotel-card shadowed_box">
      <div className="adm_hotels-content">
        <img src={admhotel} alt="" />
        <div className="adm_hotel-title">{name}</div>
        <div className="adm_hotel-loc">
          {locationId ? locationId.locationName + ", " : "Место загружается"}
          {locationId ? locationId.locationCountry : null}
        </div>
        <div className="adm_hotel-rating row">
          {hotelStars ? <HotelStars number={hotelStars} /> : null}

          {rating ? <RatingBox rating={rating} /> : null}
          <div className="extra_place-box">
            <img src={check2} alt="" /> Доп. места
          </div>
        </div>
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
        <div className="card_mid-tags">
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
        <button className="primary-btn">Открыть</button>
      </div>
    </div>
  );
};

export default DashHotelCard;
