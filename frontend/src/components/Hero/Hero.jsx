import React, { useState } from "react";

import SearchPanel from "../SearchPanel/SearchPanel";

import herologo from "../../assets/herologo.png";
import bot from "../../assets/bot.svg";

import "./Hero.scss";

const Hero = ({ changeAmount, changeDaysAmount, changeDate, handleSearch }) => {
  return (
    <section className="hero_section">
      <div className="container hero">
        <div className="wrapper hero_wrapper ver">
          <img src={herologo} alt="" className="hero_img" />
          <img src={bot} alt="" className="bottom" />
          <SearchPanel
            changeAmount={changeAmount}
            changeDaysAmount={changeDaysAmount}
            changeDate={changeDate}
            handleSearch={handleSearch}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
