import React from "react";

import style from "./Home.module.scss";

const MobileHome = () => {
  return (
    <div className={style.container}>
      <div className={style.preview} />

      <div className={style.tour_container}>
        <h3 className={style.tour_title}>Найти подходящий тур</h3>
      </div>
    </div>
  );
};
export default MobileHome;
