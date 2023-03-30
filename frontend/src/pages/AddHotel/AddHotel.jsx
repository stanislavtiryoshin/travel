import React, { useState, useEffect } from "react";
import axios from "axios";

import addhotel from "../../assets/addhotel.png";

import "./AddHotel.scss";

const AddHotel = () => {
  const [hotelData, setHotelData] = useState({
    services: [{ serviceId: "64258af02ba7928f871a09cd" }],
    locationId: null,
    name: "",
    locSpecialty: "",
    mapLink: "",
    rating: null,
    description: "",
  });
  const [allLocations, setAllLocations] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [newServices, setNewServices] = useState([
    { serviceId: "64258af02ba7928f871a09cd" },
  ]);

  const addService = (number, serviceId) => {
    let services = newServices;
    if (services[number]) {
      services[number].serviceId = serviceId;
    } else {
      services.push({ serviceId: serviceId });
    }
    setNewServices(services);
  };

  useEffect(() => {
    setHotelData({ ...hotelData, services: newServices });
    console.log(hotelData);
  }, [newServices]);

  // useEffect(() => {
  //   setHotelData({
  //     ...hotelData,
  //     services: [{ serviceId: "" }],
  //   });
  // }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/locations`)
      .then((response) => {
        setAllLocations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`http://localhost:3000/api/categories`)
      .then((response) => {
        setAllCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`http://localhost:3000/api/hotelServices`)
      .then((response) => {
        setAllServices(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [serviceCount, setServiceCount] = useState(1);

  const renderServices = () => {
    const services = [];
    for (let i = 0; i < serviceCount; i++) {
      services.push(
        <ServiceCard
          number={i + 1}
          allCategories={allCategories}
          allServices={allServices}
          addService={addService}
        />
      );
    }
    return <>{services}</>;
  };

  return (
    <div className="add_hotel-page page">
      <section className="add_gen-section">
        <div className="container">
          <div className="add_gen-wrapper wrapper shadowed_box">
            <div className="gen_img-box">
              <img src={addhotel} alt="" />
            </div>
            <div className="gen_content-box">
              <div className="gen_title">Основное об отеле</div>
              <div className="input_row">
                <input
                  type="text"
                  className="primary-input"
                  placeholder="Название"
                  onChange={() =>
                    setHotelData({ ...hotelData, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="primary-input"
                  placeholder="Особенность местоположения"
                  onChange={() =>
                    setHotelData({ ...hotelData, locSpecialty: e.target.value })
                  }
                />
              </div>
              <div className="input_row">
                <select
                  className="primary-input"
                  type="text"
                  placeholder="Местоположение"
                  name="destination"
                  value={hotelData.locationId}
                  onChange={(e) => {
                    setSearchTerms({
                      ...hotelData,
                      locationId: e.target.value,
                    });
                  }}
                >
                  {allLocations && allLocations.length >= 0 ? (
                    allLocations.map((location, idx) => {
                      return (
                        <option value={location._id} key={idx}>
                          {location.locationName}
                        </option>
                      );
                    })
                  ) : (
                    <p>Locations are loading</p>
                  )}
                </select>
                <input
                  type="text"
                  className="primary-input"
                  placeholder="Ссылка на карту"
                  onChange={() =>
                    setHotelData({ ...hotelData, mapLink: e.target.value })
                  }
                />
              </div>
              <div className="input_row">
                <input
                  type="text"
                  className="primary-input"
                  placeholder="Рейтинг отеля"
                  onChange={() =>
                    setHotelData({ ...hotelData, rating: e.target.value })
                  }
                />
                <select
                  className="primary-input"
                  type="text"
                  placeholder="Местоположение"
                  name="hotelStars"
                  value={hotelData.hotelStars}
                  onChange={(e) => {
                    setHotelData({
                      ...hotelData,
                      hotelStars: e.target.value,
                    });
                  }}
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="input_row">
                <textarea
                  className="primary-input"
                  name=""
                  id=""
                  cols="30"
                  rows="5"
                  placeholder="Описание"
                  onChange={() =>
                    setHotelData({ ...hotelData, description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="add_more-section">
        <div className="container">
          <div className="add_more-wrapper wrapper">
            <div className="add_more-col shadowed_box"></div>
            <div className="add_more-col categ-col shadowed_box">
              <div className="gen_title">Услуги отеля</div>
              {renderServices()}
              <button
                className="add_service-btn primary-btn"
                onClick={() => {
                  addService(serviceCount + 1, "64258af02ba7928f871a09cd");
                  console.log(newServices);
                  setServiceCount(serviceCount + 1);
                }}
              >
                Добавить услугу
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ServiceCard = ({
  number,
  allCategories,
  allServices,
  addService,
}) => {
  const [currCateg, setCurrCateg] = useState("Питание");
  return (
    <div className="service-card">
      <div className="service-title">Категория {number}</div>
      <div className="service-input">
        <label htmlFor="category">Категория</label>
        <select
          name="category"
          className="primary-input"
          id=""
          onChange={(e) => setCurrCateg(e.target.value)}
        >
          {allCategories && allCategories.length > 0
            ? allCategories?.map((categ, idx) => {
                return (
                  <option value={categ.categoryName} key={idx}>
                    {categ.categoryName}
                  </option>
                );
              })
            : null}
        </select>
      </div>
      <div className="service-input full">
        <label htmlFor="service">Услуги и удобства</label>
        <select
          name="service"
          id=""
          className="primary-input"
          onChange={(e) => {
            e.preventDefault();
            addService(number - 1, e.target.value);
            console.log(e.target.value);
          }}
        >
          {allServices && allServices.length > 0
            ? allServices
                .filter(
                  (service) => service.category.categoryName === currCateg
                )
                .map((serv, idx) => {
                  return (
                    <option value={serv._id} key={idx}>
                      {serv.hotelServiceName}
                    </option>
                  );
                })
            : null}
        </select>
      </div>
    </div>
  );
};

export default AddHotel;
