import React from "react";
import { useNavigate } from "react-router-dom";

import style from "./Card.module.scss";

const Card = ({ image, location, name, description }) => {
  const navigate = useNavigate();

  return (
    <div className={`${style.card_container}`}>
      <div className={`${style.card_body}`}>
        <img src={image} alt="hotel-image" />
        <div className={style.card_location}>
          {location ? location : "Алматинская область, Казахстан"}
        </div>
        <div className={style.card_name}>
          {name ? name : "Горный тур по Тянь-Шань"}
        </div>
        <div className={style.card_desc}>{description}</div>
      </div>
    </div>
  );
};

export default Card;
