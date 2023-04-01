import React, { useState, useEffect } from "react";
import axios from "axios";

import addhotel from "../../assets/addhotel.png";

import "./AddHotel.scss";

const AddHotel = () => {
  const [roomData, setRoomData] = useState();
  const [allLocations, setAllLocations] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [newServices, setNewServices] = useState([
    { serviceId: "64258af02ba7928f871a09cd" },
  ]);

  const addService = (number, serviceId) => {
    let services = newServices;
    if (
      services[number] &&
      services.some((serv) => serv.serviceId === serviceId)
    ) {
      services[number].serviceId = serviceId;
    } else {
      services.push({ serviceId: serviceId });
    }
    setNewServices(services);
  };

  const deleteService = (serviceId) => {
    let services = newServices.filter((serv) => serv.serviceId != serviceId);
    setNewServices(services);
  };

  useEffect(() => {
    setHotelData({ ...hotelData, services: newServices });
  }, [newServices]);

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
    newServices?.map((serv, idx) => {
      return (
        <ServiceCard
          number={idx + 1}
          allCategories={allCategories}
          allServices={allServices}
          addService={addService}
          deleteService={deleteService}
        />
      );
    });
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
                  onChange={(e) =>
                    setHotelData({ ...hotelData, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="primary-input"
                  placeholder="Особенность местоположения"
                  onChange={(e) =>
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
                    setHotelData({
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
                  onChange={(e) =>
                    setHotelData({ ...hotelData, mapLink: e.target.value })
                  }
                />
              </div>
              <div className="input_row">
                <input
                  type="text"
                  className="primary-input"
                  placeholder="Рейтинг отеля"
                  onChange={(e) =>
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
                  onChange={(e) =>
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
            <div className="add_more-col more-col shadowed_box">
              <div className="gen_title">Подробнее</div>
              <div className="input_box">
                <div className="input_title">Время заезда</div>
                <div className="input_row">
                  <select
                    name=""
                    id=""
                    className="primary-input"
                    onChange={(e) =>
                      setHotelData({ ...hotelData, enterTime: e.target.value })
                    }
                  >
                    <option value="" disabled selected>
                      Заезд с
                    </option>
                    <option value="07:00">07:00</option>
                    <option value="07:00">08:00</option>
                    <option value="07:00">09:00</option>
                    <option value="07:00">10:00</option>
                  </select>
                  <select
                    name=""
                    id=""
                    className="primary-input"
                    onChange={(e) =>
                      setHotelData({ ...hotelData, leaveTime: e.target.value })
                    }
                  >
                    <option value="" disabled selected>
                      Выезд с
                    </option>
                    <option value="07:00">07:00</option>
                    <option value="07:00">08:00</option>
                    <option value="07:00">09:00</option>
                    <option value="07:00">10:00</option>
                  </select>
                </div>
              </div>
              <div className="input_box">
                <div className="input_title">Дети</div>
                <div className="input_row">
                  <select
                    name="babyMaxAge"
                    id=""
                    className="primary-input"
                    onChange={(e) =>
                      setHotelData({
                        ...hotelData,
                        kids: { ...hotelData.kids, babyMaxAge: e.target.value },
                      })
                    }
                  >
                    <option value="" disabled selected>
                      Макс. возр. млад.
                    </option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <select
                    name="kidMaxAge"
                    id=""
                    className="primary-input"
                    onChange={(e) =>
                      setHotelData({
                        ...hotelData,
                        kids: { ...hotelData.kids, kidMaxAge: e.target.value },
                      })
                    }
                  >
                    <option value="" disabled selected>
                      Макс. возр. реб.
                    </option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                  </select>
                </div>
                <div className="input_row">
                  <div className="service-input">
                    <label htmlFor="discountType">Тип скидки для ребенка</label>

                    <select
                      name="discountType"
                      id=""
                      className="primary-input"
                      onChange={(e) =>
                        setHotelData({
                          ...hotelData,
                          kids: {
                            ...hotelData.kids,
                            kidDiscount: {
                              ...hotelData.kids.kidDiscount,
                              discountType: e.target.value,
                            },
                          },
                        })
                      }
                    >
                      <option value="В тенге">В тенге</option>
                      <option value="В процентах">В процентах</option>
                    </select>
                  </div>
                  <div className="service-input">
                    <label htmlFor="discount">Скидка</label>
                    <input
                      type="number"
                      name="discount"
                      className="primary-input"
                      placeholder="2000"
                      onChange={(e) =>
                        setHotelData({
                          ...hotelData,
                          kids: {
                            ...hotelData.kids,
                            kidDiscount: {
                              ...hotelData.kids.kidDiscount,
                              discountValue: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="input_box">
                <div className="input_title">Тип питания</div>
                <select
                  name="foodType"
                  id=""
                  className="primary-input"
                  onChange={(e) =>
                    setHotelData({ ...hotelData, food: e.target.value })
                  }
                >
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                </select>
                <div className="input_row">
                  <input
                    type="text"
                    className="primary-input"
                    name="adultFoodPrice"
                    placeholder="Цена за питание взрослого"
                  />
                  <input
                    type="number"
                    name="kidFoodPrice"
                    className="primary-input"
                    placeholder="Цена за детское питание"
                  />
                </div>
              </div>
              <div className="input_box">
                <div className="input_title">Удобства</div>
                <select
                  name="foodType"
                  id=""
                  className="primary-input"
                  onChange={(e) =>
                    setHotelData({ ...hotelData, services: e.target.value })
                  }
                >
                  <option value="" disabled selected>
                    Введите значение
                  </option>
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                  <option value="Без питания">Без питания</option>
                </select>
              </div>
              <div className="input_box">
                <div className="input_title">Удобства</div>
                <div className="input_row">
                  <div className="service-input">
                    <label htmlFor="paymentType">Оплата за</label>
                    <select name="" id="" className="primary-input">
                      <option value="Оплата за номер">Оплата за номер</option>
                      <option value="Оплата за человека">
                        Оплата за человека
                      </option>
                    </select>
                  </div>
                  <div className="service-input">
                    <label htmlFor="paymentType">Предоплата</label>
                    <select name="" id="" className="primary-input">
                      <option value="30">30%</option>
                      <option value="40">40%</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="add_more-col categ-col shadowed_box">
              <div className="gen_title">Услуги отеля</div>
              {newServices?.map((serv, idx) => {
                return (
                  <ServiceCard
                    number={idx + 1}
                    allCategories={allCategories}
                    allServices={allServices}
                    addService={addService}
                    deleteService={deleteService}
                  />
                );
              })}
              <button
                className="add_service-btn primary-btn"
                onClick={() => {
                  addService(serviceCount + 1, "64258af02ba7928f871a09cd");
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
  deleteService,
}) => {
  const [currCateg, setCurrCateg] = useState("Питание");
  const [currServ, setCurrServ] = useState("64258af02ba7928f871a09cd");
  return (
    <div className="service-card">
      <div className="service-title">
        Категория {number}{" "}
        <button onClick={() => deleteService(currServ)}>X</button>
      </div>
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
            setCurrServ(e.target.value);
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
