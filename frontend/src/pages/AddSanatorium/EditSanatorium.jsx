import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getSingleSanatorium } from "../../features/sanatorium/sanatoriumSlice";
import AddSanatorium from "./AddSanatorium";
import DashRoom from "../AddHotel/DashRoom";
import EmptyHolder from "../../components/HotelPage/EmptyHolder";

const EditSanatorium = () => {
  const dispatch = useDispatch();
  const { sanatoriumId } = useParams();
  const { singleSanatorium } = useSelector((state) => state.sanatoriums);
  useEffect(() => {
    dispatch(getSingleSanatorium(sanatoriumId));
  }, [sanatoriumId]);

  const updateSanatoriumData = () => {
    dispatch(getSingleSanatorium(sanatoriumId));
  };

  console.log(singleSanatorium);
  return (
    <>
      <div className="admin_hotel-page page">
        <AddSanatorium
          fetchedSanatoriumData={singleSanatorium}
          updateSanatoriumData={updateSanatoriumData}
          editMode
        />
        <section className="admin_rooms-section">
          <div className="container">
            <div className="admin_rooms-wrapper wrapper ver shadowed_box">
              <div className="admin_rooms-top">
                <div className="gen_title">Номера</div>
                <Link
                  to={`/dashboard/hotel/${sanatoriumId}/add-room`}
                  className="primary-btn"
                >
                  Добавить номер
                </Link>
              </div>
              {singleSanatorium?.rooms &&
              singleSanatorium?.rooms?.length > 0 ? (
                <div className="admin_rooms-grid">
                  {singleSanatorium?.rooms.map((room, idx) => {
                    return <DashRoom room={room} />;
                  })}
                </div>
              ) : (
                <EmptyHolder text="Вы пока не создали номера для этого санатория" />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EditSanatorium;
