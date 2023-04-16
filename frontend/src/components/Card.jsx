import React from "react";
import { useNavigate } from "react-router-dom";

import foodTag from "../assets/tag.svg";
import calendar from "../assets/tableCalendar.svg";

import style from "./Card.module.scss";

const Card = ({
  image,
  location,
  name,
  food,
  stars,
  duration,
  price,
  id,
  isTour,
  isHotel,
}) => {
  const navigate = useNavigate();
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
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
        <div className={style.card_stars_body}>
          <div className={style.card_stars}>{stars}</div>
        </div>

        <div className={style.card_info}>
          <div className={style.periods}>
            <img src={calendar} alt="" />
            {duration ? `(${duration} дн.)` : "(2 дн.)"}
          </div>

          <div className={style.food}>
            {food && (
              <>
                <img src={foodTag} alt="food tag" />
                {food}
              </>
            )}
          </div>
        </div>
      </div>
      <div className={style.card_button}>
        <div className={style.price}>от {price ? price : 120000} тг</div>
        <button
          onClick={() => {
            navigate(isTour ? `/tour/${id}` : isHotel ? `/hotels/${id}` : "");
            goToTop();
          }}
          style={{ width: "100%" }}
          className="primary-btn"
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default Card;
