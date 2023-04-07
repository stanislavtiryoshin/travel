import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getSingleHotel, reset } from "../../features/hotel/hotelSlice";

import { setNewHotelData } from "../../features/adminSlice";

import "./AddHotel.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import AddHotel from "./AddHotel";
import DashRoom from "./DashRoom";
import Table from "../../components/Table";
import {
  useGetRoomsQuery,
  useUploadCsvMutation,
} from "../../features/services/csv.service";

const AdminHotel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hotelId } = useParams();
  const { singleHotel, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.hotels
  );

  const { data, isLoading: isRoomLoaded } = useGetRoomsQuery(hotelId);

  const [upload, { isLoading: isUploading }] = useUploadCsvMutation();

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    let obj = {
      id: hotelId,
      file: formData,
    };
    await upload(obj)
      .then((response) => console.log(response))
      .catch((err) => console.error(err))
      .finally(() => (importRef.current.value = null));
  };

  const importRef = useRef(null);

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
              <div
                className="gen_title"
                onClick={() => console.log(singleHotel)}
              >
                Номера
              </div>
              <Link
                to={`/dashboard/hotel/${hotelId}/add-room`}
                target={"_blank"}
                className="primary-btn"
              >
                Добавить номер
              </Link>
            </div>
            <div className="admin_rooms-grid">
              {singleHotel?.rooms && singleHotel?.rooms?.length > 0
                ? singleHotel?.rooms.map((room, idx) => {
                    return <DashRoom room={room} />;
                  })
                : null}
              {/* {console.log("rooms", singleHotel.rooms)} */}
            </div>
          </div>
        </div>
      </section>

      {/* <section className="room_price_table">
        <div className="container">
          <div className="admin_rooms-wrapper wrapper ver shadowed_box">
            <div className="admin_rooms-top">
              <div className="gen_title">Цены на номера</div>
              <input type="file" hidden ref={importRef} onChange={handleFile} />
              <button
                onClick={() => importRef.current.click()}
                className="import-btn"
              >
                Импортировать Excel
              </button>
            </div>
            <div className="wrapper ver">
              <Table isUploading={isUploading} data={!isRoomLoaded && data} />
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default AdminHotel;
