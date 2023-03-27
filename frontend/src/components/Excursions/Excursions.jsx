import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getExcursions, reset } from "../../features/excursion/excursionSlice";
import excphoto from "../../assets/exc.png";

import "./Excursions.scss";

const Excursions = ({ locationId }) => {
  const dispatch = useDispatch();

  const { excursions, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.excursions
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getExcursions(locationId));
    dispatch(reset());
  }, [locationId, dispatch]);
  console.log(excursions);

  return (
    <div className="side_exc-box shadowed_box small">
      <div className="body_title-box">
        <div className="body_title">
          Дополните свой отдых яркими впечатлениями!
        </div>
        <div className="body_title-text">
          Просто выберите экскурсию, которую хотели бы добавить с свой тур и мы
          включим его в стоимость
        </div>
      </div>
      <div className="exc_box">
        {excursions &&
          excursions?.map((exc, index) => {
            return (
              <div className="exc_card">
                <div className="exc_top row">
                  <div className="exc_img">
                    <img src={excphoto} alt="" />
                  </div>
                  <div className="exc_content">
                    <div className="exc_title">{exc.name}</div>
                    <div className="exc_desc">{exc.description}</div>
                    <button className="exc_more-btn">Подробнее</button>
                  </div>
                </div>
                <div className="exc_bot"></div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Excursions;
