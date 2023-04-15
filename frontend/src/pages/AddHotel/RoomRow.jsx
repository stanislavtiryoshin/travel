import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateRoom } from "../../features/room/roomSlice";

const RoomRow = ({ room, handlePriceChange, periods, prices }) => {
  const dispatch = useDispatch();
  const [periodPrices, setPeriodPrices] = useState([
    { periodId: "", roomPrice: 0 },
  ]);

  useEffect(() => {
    if (room && room?.periodPrices && room?.periodPrices.length > 0) {
      let newPeriodPrices = [...room.periodPrices];
      if (newPeriodPrices?.length < periods?.length) {
        const diff = periods.length - newPeriodPrices.length;
        for (let i = 0; i < diff; i++) {
          if (i < periods.length) {
            newPeriodPrices.push({
              periodId: periods[periods.length - diff + i]._id,
              roomPrice: 0,
            });
          } else {
            newPeriodPrices.push({ periodId: "", roomPrice: 0 });
          }
        }
      }
      setPeriodPrices(newPeriodPrices);
    } else {
      setPeriodPrices((prevPeriodPrices) => {
        const newPeriodPrices = periods?.map((per) => ({
          periodId: per._id,
          startDay: per.startDay,
          startMonth: per.startMonth,
          endDay: per.endDay,
          endMonth: per.endMonth,
          roomPrice: 0,
        }));
        return newPeriodPrices;
      });
    }
  }, [periods, room]);

  return (
    <>
      {room ? (
        <tr key={room._id} style={{ margin: "5px" }}>
          <td className="first_col">
            {room?.roomName}{" "}
            {room._id && (
              <button
                className="price-btn"
                onClick={() => {
                  dispatch(
                    updateRoom({
                      _id: room._id,
                      periodPrices: periodPrices,
                    })
                  );
                  console.log({
                    _id: room._id,
                    periodPrices: periodPrices,
                  });
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke="#2569D7"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
                    stroke="#2569D7"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            )}
          </td>
          {periodPrices &&
            periodPrices?.map((period, idx) => {
              let newPrices = [...periodPrices];
              const corrPeriod = periods?.find((per) => per._id === period._id);
              return (
                <td key={period._id} style={{}}>
                  <input
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
      ) : null}
    </>
  );
};

export default RoomRow;
