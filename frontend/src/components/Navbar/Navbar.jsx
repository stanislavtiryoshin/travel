import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../../features/auth/authSlice";
import { PatternFormat } from "react-number-format";
import { setCurrentTab } from "../../features/adminSlice";

import logo from "../../assets/logo.svg";
import phone from "../../assets/phone.svg";
import photo from "../../assets/photo.png";

import "./Navbar.scss";
import SearchPanel from "../SearchPanel/SearchPanel";

const Navbar = ({ isSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const [phone, setPhone] = useState();

  const handleSendPhone = () => {
    axios
      .post("/api/send-phone-email", { phone: phone })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    setPhone("");

    console.log({ phone: phone });
  };

  const { currentTab } = useSelector((state) => state.admin);

  const tabsContent = [
    { id: 0, label: "Заявки" },
    { id: 1, label: "Отели" },
    // { id: 2, label: "1-3 туры" },
    // { id: 3, label: "Лагеря" },
    // { id: 4, label: "Санатории" },
    // { id: 5, label: "Менеджеры" },
  ];

  const renderTabs = () => {
    return tabsContent.map((tab, index) => {
      const isActive = currentTab === index;
      return (
        <Link
          className={`tab-btn ${isActive ? "active" : ""}`}
          onClick={() => dispatch(setCurrentTab(index))}
          key={tab.label}
        >
          {tab.label}
        </Link>
      );
    });
  };

  const location = useLocation();

  // Check if the current url is "/dashboard"
  const [showMainCta] = useState(
    location.pathname === "/hotels" ||
      location.pathname === "/sanatoriums" ||
      location.pathname === "/camps" ||
      location.pathname === "/tours" ||
      location.pathname === "/add-order"
  );

  console.log(showMainCta);

  const [showSearchPanel] = useState(
    location.pathname.includes("/hotels/") ||
      location.pathname.includes("/sanatoriums/") ||
      location.pathname.includes("/camps/") ||
      location.pathname.includes("/tours/")
  );

  const [showDashNav] = useState(location.pathname.includes("/dashboard"));

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  const containsDashboard = location.pathname.includes("/dashboard");
  const isHotels = location.pathname.includes("/hotels/");
  const [isHome] = useState(location.pathname === "/");
  const [isOrder] = useState(location.pathname === "/orders/new-order");

  return (
    <>
      <header>
        <div className="container">
          <div className="nav_wrapper wrapper">
            <div className="nav_left">
              <select name="lang" id="" className="lang_select">
                <option value="ru">RU</option>
                <option value="en">EN</option>
                <option value="kz">KZ</option>
              </select>
              <img src={logo} alt="" className="header_logo" />
            </div>
            {showDashNav ? (
              <div className="nav_tabs">{renderTabs()}</div>
            ) : null}
            <div className="nav_right">
              <div className="tel_box">
                <img src={phone} alt="" className="phone_icon" />
                <div className="tel_box-content">
                  <div className="tel_box-top">Работаем с 10:00 до 19:00</div>
                  <a href="tel:+77007007700" className="tel_box-link">
                    +7 (700) 700-77-00
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {!showDashNav ? (
        <>
          <div className="header_bot">
            <div className="container">
              <div className="header_bot-wrapper wrapper">
                <div className="header_bot-left wrapper">
                  {showMainCta ? (
                    <>
                      <img src={photo} alt="" className="header_bot-photo" />
                      <div className="header_bot-left-text">
                        Хотите найти тур мечты?
                      </div>
                    </>
                  ) : null}

                  {showSearchPanel && <SearchPanel isUserLook />}
                </div>
                {!showDashNav ? (
                  <form
                    className="header_bot-right wrapper"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendPhone();
                    }}
                  >
                    <PatternFormat
                      className="header_bot-input"
                      placeholder="+7 (...)"
                      format="+7 (###) ### ## ##"
                      allowEmptyFormatting={false}
                      value={phone}
                      mask="."
                      required
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button className="primary-btn yellow" type="submit">
                      Заказать звонок
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
          {/* <div className="search-panel">
            {isHotels && (
              <SearchPanel
                style={{ marginBottom: "0px !important" }}
                isUserLook
              />
            )}
          </div> */}
        </>
      ) : null}
    </>
  );
};

export default Navbar;
