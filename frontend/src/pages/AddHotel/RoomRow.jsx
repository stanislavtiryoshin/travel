import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateRoom } from "../../features/room/roomSlice";

const RoomRow = ({ room, handlePriceChange, periods, prices }) => {
  const dispatch = useDispatch();
  const [periodPrices, setPeriodPrices] = useState([
    { periodId: "", roomPrice: 0 },
  ]);

  useEffect(() => {
    if (room.periodPrices && room.periodPrices.length > 0) {
      let newPeriodPrices = [...room.periodPrices];
      if (newPeriodPrices.length < periods.length) {
        const diff = periods.length - newPeriodPrices.length;
        for (let i = 0; i < diff; i++) {
          newPeriodPrices.push({ periodId: "", roomPrice: 0 });
        }
      }
      setPeriodPrices(newPeriodPrices);
    } else {
      setPeriodPrices((prevPeriodPrices) => {
        const newPeriodPrices = periods.map((per) => ({
          periodId: per._id,
          roomPrice: 0,
        }));
        return newPeriodPrices;
      });
    }
  }, [periods, room]);

  console.log(periodPrices);

  return (
    <tr key={room._id} style={{ margin: "5px" }}>
      <td>
        {room.roomName}{" "}
        {room._id && (
          <button
            className="price-btn"
            style={{ background: "lime" }}
            onClick={() =>
              dispatch(
                updateRoom({
                  _id: room._id,
                  periodPrices: periodPrices,
                })
              )
            }
          >
            изменить цены
          </button>
        )}
      </td>
      {periodPrices &&
        periodPrices?.map((period, idx) => {
          let newPrices = [...periodPrices];
          // newPrices[idx] = {
          //   ...newPrices[idx],
          //   periodId: period._id,
          // };
          return (
            <td key={period._id} style={{}}>
              <input
                style={{ background: "lightgrey", margin: "5px" }}
                type="number"
                value={newPrices[idx].roomPrice}
                onChange={(e) => {
                  newPrices[idx] = {
                    ...newPrices[idx],
                    roomPrice: e.target.value,
                  };
                  setPeriodPrices(newPrices);
                }}
              />
            </td>
          );
        })}
    </tr>
  );
};

export default RoomRow;
