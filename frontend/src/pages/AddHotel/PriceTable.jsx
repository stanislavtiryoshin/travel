import React from "react";
import dateConfig from "../../components/DataConfig";
import Section from "../../components/Section";
import RoomRow from "./RoomRow";

const PriceTable = ({ fetchedHotelData, hotelData }) => {
  return (
    <>
      {fetchedHotelData &&
      fetchedHotelData?.periods?.length > 0 &&
      fetchedHotelData?.rooms?.length > 0 ? (
        <Section section="tb_section" wrapper="tb_wrapper ver shadowed_box">
          <div className="periods_top">
            <div className="gen_title">Цены на номера</div>
            <div className="periods_btns">
              <button className="primary-btn black">Сохранить</button>
            </div>
          </div>
          <div className="table_wrapper">
            <table className="periods_table">
              <thead>
                <tr>
                  <th>Номера и периоды</th>
                  {hotelData &&
                    hotelData.periods &&
                    hotelData?.periods?.map((period) => (
                      <th key={period._id}>
                        {dateConfig(period.startDay)}.
                        {dateConfig(period.startMonth)} -{" "}
                        {dateConfig(period.endDay)}.
                        {dateConfig(period.endMonth)}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {fetchedHotelData &&
                  fetchedHotelData.rooms &&
                  fetchedHotelData.periods &&
                  fetchedHotelData?.rooms?.map((room) => (
                    <RoomRow
                      key={room._id}
                      room={room}
                      periodPrices={room.periodPrices}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </Section>
      ) : null}
    </>
  );
};

export default PriceTable;
