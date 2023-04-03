import React from "react";

import style from "./Requests.module.scss";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import RequestTable from "./RequestTable";

const Requests = () => {
  return (
    <>
      <div className={style.search}>
        <HotelSearch reqMode />
      </div>

      <section className="dash_section">
        <RequestTable />
      </section>
    </>
  );
};

export default Requests;
