import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

import addhotel from "../../assets/addhotel.png";

import { setNewHotelData } from "../../features/adminSlice";
import { addHotel } from "../../features/hotel/hotelSlice";

import "./AddHotel.scss";
import { useDispatch, useSelector } from "react-redux";
import Selector from "./Select";
import { AdminHead } from "../../components/Admin";
import { AdminAddForm } from "../../components/Admin/AdminAddForm";
import { Input } from "../../components/Form";

const AddHotel = () => {
  const [hotelData, setHotelData] = useState({
    hotelServices: [{ serviceId: "64258af02ba7928f871a09cd" }],
    locationId: null,
    name: "",
    locSpecialty: "",
    mapLink: "",
    rating: null,
    description: "",
    enterTime: "07:00",
    leaveTime: "07:00",
    food: null,
    kidFoodPrice: null,
    adultFoodPrice: null,
    kids: {
      babyMaxAge: null,
      kidMaxAge: null,
      kidDiscount: {
        discountType: "В тенге",
        discountValue: 2000,
      },
    },
    payment: {
      paymentType: "",
      prepayment: null,
    },
  });

  const dispatch = useDispatch();

  const [allLocations, setAllLocations] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [servicesObjs, setServicesObjs] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const { newHotelData } = useSelector((state) => state.admin);

  useEffect(() => {
    let services = [];
    allServices.map((serv, idx) => {
      services.push({
        value: serv.hotelServiceName,
        label: serv.hotelServiceName,
        category: serv.category.categoryName,
        servId: serv._id,
      });
    });
    setServicesObjs(services);
  }, [allServices]);

  useEffect(() => {
    let services = [];
    selectedOptions.map((serv, idx) => {
      services.push({ serviceId: serv.servId });
    });
    setNewServices(services);
  }, [selectedOptions]);

  function handleSelect(data) {
    setSelectedOptions(data);
  }

  useEffect(() => {
    dispatch(setNewHotelData(hotelData));
  }, [hotelData]);

  console.log(hotelData);

  const [newServices, setNewServices] = useState([
    { serviceId: "64258af02ba7928f871a09cd" },
  ]);

  const [addedServices, setAddedServices] = useState([
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
    setHotelData({ ...hotelData, hotelServices: newServices });
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
      .then(({ data }) => {
        setAllCategories(data);
        console.log(data);
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

  return (
    <>
      <AdminHead
        text="Создание нового отеля"
        onClick={() => dispatch(addHotel(hotelData))}
      />
      <div className="add_hotel-page page">
        <section className="add_gen-section">
          <div className="container">
            <div className="add_gen-wrapper wrapper shadowed_box">
              <AdminAddForm img={addhotel}>
                <div className="gen_content-box">
                  <div className="gen_title">Основное об отеле</div>
                  <div className="input_row">
                    <Input
                      placeholder="Название"
                      onChange={(e) => {
                        setHotelData({ ...hotelData, name: e.target.value });
                      }}
                    />
                    <Input
                      placeholder="Особенность местоположения"
                      onChange={(e) =>
                        setHotelData({
                          ...hotelData,
                          locSpecialty: e.target.value,
                        })
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
                    <Input
                      placeholder="Ссылка на карту"
                      onChange={(e) =>
                        setHotelData({ ...hotelData, mapLink: e.target.value })
                      }
                    />
                  </div>
                  <div className="input_row">
                    <Input
                      placeholder="Рейтинг отеля"
                      onChange={(e) =>
                        setHotelData({ ...hotelData, rating: e.target.value })
                      }
                    />

                    <select
                      className="primary-input"
                      type="number"
                      placeholder="Звезды отеля"
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
                        setHotelData({
                          ...hotelData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </AdminAddForm>
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
                        setHotelData({
                          ...hotelData,
                          enterTime: e.target.value,
                        })
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
                        setHotelData({
                          ...hotelData,
                          leaveTime: e.target.value,
                        })
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
                          kids: {
                            ...hotelData.kids,
                            babyMaxAge: e.target.value,
                          },
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
                          kids: {
                            ...hotelData.kids,
                            kidMaxAge: e.target.value,
                          },
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
                      <label htmlFor="discountType">
                        Тип скидки для ребенка
                      </label>

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
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                  </select>
                  <div className="input_row">
                    <input
                      type="text"
                      className="primary-input"
                      name="adultFoodPrice"
                      placeholder="Цена за питание взрослого"
                      onChange={(e) => {
                        setHotelData({
                          ...hotelData,
                          adultFoodPrice: e.target.value,
                        });
                      }}
                    />
                    <input
                      type="number"
                      name="kidFoodPrice"
                      className="primary-input"
                      placeholder="Цена за детское питание"
                      onChange={(e) => {
                        setHotelData({
                          ...hotelData,
                          kidFoodPrice: e.target.value,
                        });
                      }}
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
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                    <option value="642150a586cfa75278c280b9">
                      Без питания
                    </option>
                  </select>
                </div>
                <div className="input_box">
                  <div className="input_title">Тип оплаты</div>
                  <div className="input_row">
                    <div className="service-input">
                      <label htmlFor="paymentType">Оплата за</label>
                      <select
                        name=""
                        id=""
                        className="primary-input"
                        onChange={(e) => {
                          setHotelData({
                            ...hotelData,
                            payment: {
                              ...hotelData.payment,
                              paymentType: e.target.value,
                            },
                          });
                        }}
                      >
                        <option value="Оплата за номер">Оплата за номер</option>
                        <option value="Оплата за человека">
                          Оплата за человека
                        </option>
                      </select>
                    </div>
                    <div className="service-input">
                      <label htmlFor="paymentType">Предоплата</label>
                      <select
                        name=""
                        id=""
                        className="primary-input"
                        onChange={(e) => {
                          setHotelData({
                            ...hotelData,
                            payment: {
                              ...hotelData.payment,
                              prepayment: e.target.value,
                            },
                          });
                        }}
                      >
                        <option value="30">30%</option>
                        <option value="40">40%</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="add_more-col categ-col shadowed_box">
                <div className="gen_title">Услуги отеля</div>
                {addedServices?.map((serv, idx) => {
                  return (
                    <ServiceCard
                      number={idx + 1}
                      allCategories={allCategories}
                      allServices={allServices}
                      addService={addService}
                      deleteService={deleteService}
                      optionList={servicesObjs}
                      selectedOptions={selectedOptions}
                      handleSelect={handleSelect}
                    />
                  );
                })}
                <button
                  className="add_service-btn primary-btn"
                  onClick={() => {
                    setAddedServices((prev) => [...prev, {}]);
                  }}
                >
                  Добавить услугу
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export const ServiceCard = ({
  number,
  allCategories,
  allServices,
  addService,
  deleteService,
  optionList,
  selectedOptions,
  handleSelect,
}) => {
  const [currCateg, setCurrCateg] = useState("Питание");
  const [currServ, setCurrServ] = useState("64258af02ba7928f871a09cd");
  const [thisCategServices, setThisCategServices] = useState();

  useEffect(() => {
    setThisCategServices(
      selectedOptions.filter((serv) => serv.category === currCateg)
    );
  }, [currCateg]);

  return (
    <div className="service-card">
      <div className="service-title">
        Категория {number}{" "}
        <button onClick={() => deleteService(currServ)}>X</button>
      </div>

      <Selector
        allCategories={allCategories}
        optionList={optionList}
        thisCategServices={thisCategServices}
      />
    </div>
  );
};

export default AddHotel;
