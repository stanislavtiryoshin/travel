import { useState } from "react";

import style from "./Layout.module.scss";
import loupe from "../../../assets/loupe.svg";
import burger from "../../../assets/burger.svg";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={style.nav_container}>
      <div className={style.nav_burger} onClick={() => setIsOpen(!isOpen)}>
        <img src={burger} alt="Menu Toggle" />
      </div>
      <div className={style.nav_title}>Uly Dala</div>
      <div className={style.nav_search}>
        <img src={loupe} alt="Search" />
      </div>
    </nav>
  );
};
