import React, { useState, useEffect } from "react";

import RatingBox from "./RatingBox";

import admhotel from "../../assets/admhotel.png";
import check2 from "../../assets/check2.svg";
import HotelStars from "../HotelStars/HotelStars";
import tag from "../../assets/tag.svg";
import { Link } from "react-router-dom";
import declOfNum from "../DayConfig";

const DashHotelCard = ({ hotel, tour, mode }) => {
  const {
    name,
    rating,
    stars,
    locationId,
    hotelStars,
    _id,
    extraPlaces,
    img,
    rooms,
    hotelServices,
    food,
  } = hotel;

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

  const [roomsCount, setRoomsCount] = useState([]);
  const [capCount, setCapCount] = useState([]);

  useEffect(() => {
    setRoomsCount(
      rooms?.reduce((acc, curr) => {
        if (acc[curr.roomType]) {
          acc[curr.roomType] += curr.roomsNumber;
        } else {
          acc[curr.roomType] = curr.roomsNumber;
        }
        return acc;
      }, {})
    );

    setCapCount(
      rooms?.reduce((acc, curr) => {
        if (acc[curr.capacity]) {
          acc[curr.capacity] += curr.roomsNumber;
        } else {
          acc[curr.capacity] = curr.roomsNumber;
        }
        return acc;
      }, {})
    );
  }, [rooms]);

  // const roomsCount = rooms?.reduce((acc, curr) => {
  //   if (acc[curr.roomType]) {
  //     acc[curr.roomType] += curr.roomsNumber;
  //   } else {
  //     acc[curr.roomType] = curr.roomsNumber;
  //   }
  //   return acc;
  // }, {});

  // const capCount = rooms?.reduce((acc, curr) => {
  //   if (acc[curr.roomType]) {
  //     acc[curr.capacity] += curr.roomsNumber;
  //   } else {
  //     acc[curr.capacity] = curr.roomsNumber;
  //   }
  //   return acc;
  // }, {});

  console.log(roomsCount);
  console.log(capCount);

  return (
    <div className="adm_hotel-card shadowed_box">
      <div className="adm_hotels-content">
        <img
          src={img && img.length > 0 ? img[0] : admhotel}
          alt=""
          style={{ width: "270px", height: "120px", objectFit: "cover" }}
        />
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
            {capCount && Object.keys(capCount).length > 0 ? (
              <>
                <div className="feats_col">
                  <div className="feats_title">Номера</div>

                  {Object.entries(capCount).map(([cap, num]) => {
                    return (
                      <div key={cap} className="feats_row">
                        {cap} мест.: {num}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
            {roomsCount && Object.keys(roomsCount).length > 0 ? (
              <>
                <div className="feats_col">
                  <div className="feats_title">Классы</div>

                  {Object.entries(roomsCount).map(([roomType, num]) => {
                    return (
                      <div key={roomType} className="feats_row">
                        {roomType}: {num}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
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
              {food ? food.label : null}
            </div>
          )}
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
      <div className="adm_hotel-btns">
        <Link
          to={
            mode === "hotel"
              ? `/dashboard/hotel/${_id}`
              : `/dashboard/sanatorium/${_id}`
          }
          className="primary-btn clear"
        >
          Редактировать
        </Link>
      </div>
    </div>
  );
};

export default DashHotelCard;
