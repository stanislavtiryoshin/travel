import React from "react";
import "./HotelStars.scss";

import star from "../../assets/star.svg";

const HotelStars = ({ number }) => {
  const stars = [];
  for (let i = 0; i < number; i++) {
    stars.push(<img src={star} alt="star" key={i} />);
  }
  return <div className="stars-box">{stars}</div>;
};

export default HotelStars;
