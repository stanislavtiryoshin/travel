import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getSingleHotel, reset } from "../../features/hotel/hotelSlice";

import { setNewHotelData } from "../../features/adminSlice";

import "./AddHotel.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import AddHotel from "./AddHotel";
import AdminRoom from "./AdminRoom";

const AdminHotel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hotelId } = useParams();
  const { singleHotel, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (hotelId) dispatch(getSingleHotel(hotelId));
    dispatch(reset());
  }, [hotelId]);

  console.log(singleHotel);

  return (
    <>
      <AddHotel fetchedHotelData={singleHotel} editMode />
      <section className="admin_rooms-section">
        <div className="container">
          <div className="admin_rooms-wrapper wrapper ver shadowed_box">
            <div className="admin_rooms-top">
              <div className="gen_title">Номера</div>
              <Link
                to={`/dashboard/hotel/${hotelId}/add-room`}
                className="primary-btn"
              >
                Добавить номер
              </Link>
            </div>
            <div className="admin_rooms-grid">
              {singleHotel && singleHotel.rooms
                ? singleHotel.rooms.map((room, idx) => {
                    <AdminRoom room={room} />;
                  })
                : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminHotel;
