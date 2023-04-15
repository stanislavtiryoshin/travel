import React, { useEffect } from "react";
import style from "./AddTour.module.scss";

import { AdminHead } from "../../components/Admin";
import "../AddHotel/AddHotel.scss";
import { AdminAddForm } from "../../components/Admin/AdminAddForm";
import addhotel from "../../assets/addhotel.png";
import { Input } from "../../components/Form";
import Selector from "../AddHotel/Select";
import Selector2 from "../AddHotel/Selector";

import {
  useAddTourMutation,
  // useGetCategoryQuery,
  useGetHotelServiceQuery,
  useGetHotelsQuery,
  useGetLocationQuery,
  useGetFoodQuery,
  useAddHotelServiceMutation,
} from "../../features/services/base.service";
import { useSelector } from "react-redux";
import Modal from "../../components/Modal";

const AddTour = () => {
  const { data: food = [], isLoading: isLoadFood } = useGetFoodQuery();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dayIDX, setDayIdx] = React.useState(0);
  const [foodValue, setFoodValue] = React.useState([]);
  const [comfortsValue, setComfortsValue] = React.useState([]);

  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [tourData, setTourData] = React.useState({
    locationId: null,
    name: "",
    locationFeature: "",
    departureCity: "",
    mapLink: "",
    rating: null,
    ratingVotes: 0,
    description: "",
    duration: "",
    program: [],
    food: null,
    // kidFoodPrice: null,
    // adultFoodPrice: null,
    hotelId: null,
    comforts: [],
    kids: {
      withKids: true,
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
  const { data: hotels = [], isLoading: isHotelLoaded } = useGetHotelsQuery();
  const { data: allLocations = [], isLoading } = useGetLocationQuery();
  const {
    data: service,
    isLoading: isLoadService,
    refetch,
  } = useGetHotelServiceQuery();
  const [addHotelService, { isLoading: serviceIsLoad }] =
    useAddHotelServiceMutation();
  const [allServices, setAllServices] = React.useState([]);
  const [withKid, setWithKid] = React.useState(false);

  const [addedServices, setAddedServices] = React.useState([
    {
      days: [
        {
          points: { day: null, time: "", pointName: "", pointDescription: "" },
        },
      ],
    },
  ]);

  const [createTour, { isLoading: addLoad }] = useAddTourMutation();
  const { user } = useSelector((state) => state.auth);

  const [serviceName, setServiceName] = React.useState("");

  useEffect(() => {
    if (isLoadService) {
      setAllServices([]);
    } else {
      let services = [];
      service.map((serv) => {
        services.push({
          value: serv.hotelServiceName,
          label: serv.hotelServiceName,
          category: serv.category.categoryName,
          servId: serv._id,
        });
      });
      setAllServices(services);
    }
  }, [isLoadService, serviceIsLoad]);

  const handleSubmit = async () => {
    const values = {
      ...tourData,
      program: [...addedServices],
      token: user.token,
      comforts: comfortsValue.map(({ servId }) => servId),
      food: foodValue.map(({ _id }) => _id),
    };
    await createTour(values);

    if (!addLoad) {
      localStorage.removeItem("comforts");
      localStorage.removeItem("food");
      alert("Added");
    }
  };

  const handleDelPoint = (idx, dayIdx) => {
    let newProgram = [...addedServices];
    if (idx !== 0) {
      newProgram[dayIdx].days.splice(idx, 1);
      setAddedServices(newProgram);
    }
  };

  const handleDelDay = () => {
    let newProgram = [...addedServices];
    if (newProgram.length > 1) {
      newProgram.splice(dayIDX, 1);
      setAddedServices(newProgram);
    }
    setIsOpen(false);
  };

  const addService = async () => {
    // console.log(serviceName);
    const values = {
      token: user.token,
      category: "642587032ba7928f871a09ca",
      hotelServiceName: serviceName,
    };
    if (serviceName.length > 0)
      await addHotelService(values)
        .then(setServiceName(""))
        .finally(() => {
          refetch();
        });
    else alert("Вы не ввели новые удобства");
  };

  return (
    <>
      <AdminHead text="Создание 1-3 тура" onClick={() => handleSubmit()} />
      <div className="add_hotel-page page">
        <section className="add_gen-section">
          <div className="container">
            <div className="add_gen-wrapper wrapper shadow_box">
              <AdminAddForm img={addhotel}>
                <div className="gen_content-box">
                  <div className="gen_title">Основное о туре</div>
                  <div className="input_row">
                    <Input
                      placeholder="Название"
                      onChange={(e) =>
                        setTourData({ ...tourData, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Особенность местоположения"
                      onChange={(e) =>
                        setTourData({
                          ...tourData,
                          locationFeature: e.target.value,
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
                      value={tourData.locationId}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setTourData({
                          ...tourData,
                          locationId: e.target.value,
                        });
                      }}
                      // onSelect={(e) => console.log(e.target.value)}
                    >
                      {allLocations.map((location, idx) => (
                        <option value={location._id} key={location._id}>
                          {location.locationName}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Город вылета"
                      onChange={(e) =>
                        setTourData({
                          ...tourData,
                          departureCity: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Ссылка на карту"
                      onChange={(e) =>
                        setTourData({ ...tourData, mapLink: e.target.value })
                      }
                    />
                  </div>
                  <div className="input_row">
                    <Input
                      placeholder="Рейтинг тура"
                      onChange={(e) =>
                        setTourData({ ...tourData, rating: e.target.value })
                      }
                    />
                    <select
                      className="primary-input"
                      type="number"
                      placeholder="Продолжительность тура"
                      onChange={(e) =>
                        setTourData({ ...tourData, duration: e.target.value })
                      }
                    >
                      <option value={1}>1 день</option>
                      <option value={2}>2 дня</option>
                      <option value={3}>3 дня</option>
                    </select>
                  </div>
                  <div className="input_row">
                    <textarea
                      className="primary-input"
                      cols="30"
                      rows="5"
                      placeholder="Описание"
                      onChange={(e) =>
                        setTourData({
                          ...tourData,
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
                  <div className="input_title">Отель</div>

                  <select
                    className="primary-input"
                    onChange={(e) =>
                      setTourData((prev) => ({
                        ...prev,
                        hotelId: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled selected>
                      Выбрать из списка
                    </option>
                    {isHotelLoaded ? (
                      <p>Hotels aren't loaded</p>
                    ) : (
                      <>
                        {hotels.map((hotel) => (
                          <option value={hotel._id} key={hotel._id}>
                            {hotel.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  <button
                    className="add_service-btn primary-btn"
                    onClick={() => {}}
                  >
                    Добавить отель
                  </button>
                  <div className="input_title">Тип питания</div>

                  <Selector2
                    data={food}
                    onChange={setFoodValue}
                    value={foodValue}
                    placeholder={`Введите значение`}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                      }),
                    }}
                  />

                  {/* <Selector
                    foodOption={food}
                    placeholder={`Введите значение`}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                      }),
                    }}
                  /> */}

                  <div className="input_title">Удобства</div>
                  <Selector2
                    data={allServices}
                    placeholder={`Введите значение`}
                    onChange={setComfortsValue}
                    value={comfortsValue}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                      }),
                    }}
                  />
                  <span
                    className={style.newComforts}
                    onClick={() => setIsOpenModal(true)}
                  >
                    Добавить новые удобства
                  </span>
                  {/* <Selector
                    optionList={allServices}
                    placeholder={`Введите значение`}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                      }),
                    }}
                  /> */}
                  <div className="input_title">Дети</div>
                  <div className="input_row">
                    <select
                      className="primary-input"
                      onChange={(e) => {
                        setWithKid(Boolean(e.target.value));
                        setTourData({
                          ...tourData,
                          kids: {
                            withKids: !e.target.value,
                          },
                        });
                      }}
                    >
                      <option value={false} selected>
                        Можно с детьми
                      </option>
                      <option value={true}>Без детей</option>
                    </select>

                    <select
                      disabled={withKid}
                      className="primary-input"
                      onChange={(e) => {
                        setTourData((prev) => ({
                          ...prev,
                          kids: {
                            ...prev.kids,
                            babyMaxAge: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option value="" disabled selected>
                        Мин. возр.
                      </option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>

                    <select
                      disabled={withKid}
                      className="primary-input"
                      onChange={(e) => {
                        setTourData((prev) => ({
                          ...prev,
                          kids: {
                            ...prev.kids,
                            kidMaxAge: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option value="" disabled selected>
                        Макс. возр.
                      </option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                    </select>
                  </div>
                  <div className="input_title">Оплата</div>
                  <div className="input_row">
                    {/* TODO!Чисто для показа */}
                    {/* <label className={style.info_label} htmlFor="payment">
                      Оплата за
                    </label> */}
                    <select id="payment" className="primary-input">
                      <option value="">Оплата за номер</option>
                      <option value="">Оплата за человека</option>
                    </select>
                    {/* <label className={style.info_label} htmlFor="prepayment">
                      Предоплата
                    </label> */}
                    <select id="prepayment" className="primary-input">
                      {new Array(5).fill(10).map((a, idx) => (
                        <option value={a * (idx + 1)}>{a * (idx + 1)}%</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="add_more-col categ-col shadowed_box">
                <div className="gen_title">Программа тура</div>

                {addedServices.map((serv, idx) => (
                  <div className="input_box">
                    <div className={style.days}>День {idx + 1}</div>
                    <button
                      onClick={() => {
                        setDayIdx(idx);
                        setIsOpen(true);
                      }}
                    >
                      ...
                    </button>
                    {serv.days.map((points, pointIdx) => (
                      <>
                        <div className="input_title">Пункт {pointIdx + 1}</div>
                        <button onClick={() => handleDelPoint(pointIdx, idx)}>
                          X
                        </button>
                        <div className="input_row">
                          <select
                            className="primary-input"
                            onChange={(e) => {
                              serv.days[pointIdx].points = {
                                day: idx + 1,
                                time: e.target.value,
                                pointName: "",
                                pointDescription: "",
                              };
                            }}
                          >
                            <option value="" selected disabled>
                              Время
                            </option>
                            <option value="07:00">07:00</option>
                            <option value="08:00">08:00</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                          </select>
                          <Input
                            placeholder="Название пункта"
                            onChange={(e) => {
                              serv.days[pointIdx].points.pointName =
                                e.target.value;
                            }}
                          />
                        </div>
                        <div className="input_row">
                          <textarea
                            className="primary-input"
                            cols="30"
                            rows="5"
                            placeholder="Описание"
                            onChange={(e) => {
                              serv.days[pointIdx].points.pointDescription =
                                e.target.value;
                            }}
                          />
                        </div>
                        <button
                          className={`add_service-btn ${style.bordered_btn}`}
                          onClick={() => {
                            setAddedServices((prev) => {
                              prev.map((d, id) => {
                                d.days[id + 1] = {
                                  points: {
                                    day: id + 1,
                                    time: "",
                                    pointName: "",
                                    pointDescription: "",
                                  },
                                };
                              });
                              return [...prev];
                            });
                          }}
                        >
                          Добавить пункт
                        </button>
                      </>
                    ))}
                  </div>
                ))}
                <button
                  onClick={() =>
                    setAddedServices((prev) => {
                      return [
                        ...prev,
                        {
                          days: [
                            {
                              points: {
                                day: null,
                                time: "",
                                pointName: "",
                                pointDescription: "",
                              },
                            },
                          ],
                        },
                      ];
                    })
                  }
                  className="primary-btn"
                >
                  Добавить день
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="modal-content">
          <div className="modal-title">
            Вы хотите удалить день из <br />
            программы?
          </div>
          <div className="modal-body">
            <span className="modal-select-text">При удалении дня</span>, будут
            удалены пункты <br /> программы, хранящиеся в нем. Если вы <br />
            точно хотите удалить день, то напишите
            <br />
            <span className="modal-select-text">“День {dayIDX + 1}”</span>
          </div>

          <div className="modal-button">
            <button onClick={() => handleDelDay()} className="del-btn">
              <span>Удалить день из программы</span>
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
        <div className="modal-content">
          <div className="modal-title">
            Хотите добавить новую <br /> услугу?
          </div>
          <div className="modal-body">
            <span className="modal-select-text">Название новой услуги</span>

            <Input
              style={{ width: "100%", marginTop: "22px" }}
              placeholder="Услуга"
              onChange={(e) => setServiceName(e.target.value)}
            />
            <div className="modal-button">
              <button
                style={{ width: "100%", marginTop: "10px" }}
                className="primary-btn"
                onClick={addService}
              >
                Добавить услугу
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddTour;
