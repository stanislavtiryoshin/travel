import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPeriods } from "../../features/periods/periodSlice";
import {
  addHotel,
  deletePeriod,
  updateHotel,
  updateHotelPeriods,
} from "../../features/hotel/hotelSlice";
import Section from "../../components/Section";

const Periods = ({ periods, setPeriods, updateHotelData, hotelId }) => {
  const dispatch = useDispatch();
  return (
    <Section section="periods_section" wrapper="periods_wrapper ver">
      <div className="periods_top">
        <div className="gen_title">Периоды</div>
        <div className="periods_btns">
          <button
            className="primary-btn black clear"
            onClick={() => {
              setPeriods([
                ...periods,
                {
                  startDay: null,
                  startMonth: null,
                  endDay: null,
                  endMonth: null,
                  hotel: hotelId,
                },
              ]);
            }}
          >
            + Новый период
          </button>
          <button
            className="primary-btn black"
            onClick={() => {
              dispatch(addPeriods({ periods: periods })).then(() => {
                updateHotelData();
                console.log(singleHotel);
              });
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
      <div className="periods_box">
        {periods && periods.length > 0
          ? periods?.map((per, idx) => {
              const newPeriods = periods;
              return (
                <div className="period_card shadowed_box">
                  <div className="period_title">
                    {`Период ${idx + 1}`}
                    <button
                      onClick={() => {
                        dispatch(
                          deletePeriod({
                            hotelId: hotelId,
                            periodId: per._id,
                          })
                        ).then((response) => updateHotelData());
                      }}
                    >
                      X
                    </button>
                  </div>
                  <div className="inputs_row">
                    <div className="input_col">
                      <span>Начало</span>
                      <div className="inputs_content">
                        <input
                          type="number"
                          min={1}
                          max={31}
                          placeholder="d"
                          value={per.startDay}
                          inputMode="numeric"
                          onChange={(e) => {
                            newPeriods[idx].startDay = e.target.value;
                            setPeriods(newPeriods);
                          }}
                        />
                        /
                        <input
                          type="number"
                          min={1}
                          max={31}
                          inputMode="numeric"
                          placeholder="m"
                          value={per.startMonth}
                          onChange={(e) => {
                            newPeriods[idx].startMonth = e.target.value;
                            setPeriods(newPeriods);
                          }}
                        />
                      </div>
                    </div>
                    <div className="input_col">
                      <span>Конец</span>
                      <div className="inputs_content">
                        <input
                          type="number"
                          min={1}
                          max={12}
                          placeholder="d"
                          value={per.endDay}
                          onChange={(e) => {
                            newPeriods[idx].endDay = e.target.value;
                            setPeriods(newPeriods);
                          }}
                        />
                        /
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={per.endMonth}
                          placeholder="m"
                          onChange={(e) => {
                            newPeriods[idx].endMonth = e.target.value;
                            setPeriods(newPeriods);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </Section>
  );
};

export default Periods;
