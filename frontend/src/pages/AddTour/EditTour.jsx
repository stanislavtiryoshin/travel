import React, { useEffect, useState } from "react";
import style from "./AddTour.module.scss";
import "./AddTour.scss";

import { AdminHead } from "../../components/Admin";
import "../AddHotel/AddHotel.scss";
import { AdminAddForm } from "../../components/Admin/AdminAddForm";
import addhotel from "../../assets/addhotel.png";
import { Input } from "../../components/Form";
import Selector2 from "../AddHotel/Selector";
import Section from "../../components/Section";

import {
  useGetHotelServiceQuery,
  useGetHotelsQuery,
  useGetLocationQuery,
  useGetFoodQuery,
} from "../../features/services/base.service";
import { useSelector } from "react-redux";
import {
  useEditTourByIdMutation,
  useGetTourByIdQuery,
  useLazyGetTourByIdQuery,
} from "../../features/services/edit.service";

import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { useUploadImageMutation } from "../../features/services/upload.service";
import GalleryBox from "../../components/Slider/GalleryBox";

const EditTour = () => {
  const { data: food = [], isLoading: isLoadFood } = useGetFoodQuery();

  const { id } = useParams("id");
  const [dayIDX, setDayIdx] = React.useState(0);

  // const { data: tourIdData, isLoading: IdTourLoaded } = useGetTourByIdQuery(id);
  const [tourData, setTourData] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);

  const [fetchTourById, { isLoading: IdTourLoaded }] =
    useLazyGetTourByIdQuery();

  const [uploadImage, { isLoading: uploadLoading, isError }] =
    useUploadImageMutation();

  useEffect(() => {
    fetchTourById(id).then(({ data }) => setTourData(data));
  }, []);

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
  const { data: hotels = [], isLoading: isHotelLoaded } = useGetHotelsQuery();
  const { data: allLocations = [], isLoading } = useGetLocationQuery();
  const { data: service, isLoading: isLoadService } = useGetHotelServiceQuery();
  const [allServices, setAllServices] = React.useState([]);
  const [withKid, setWithKid] = React.useState(false);

  const [foodData, setFoodData] = React.useState([]);
  const [comfortsData, setComfortsData] = React.useState([]);

  const [addedServices, setAddedServices] = React.useState([
    {
      days: [
        {
          points: { day: null, time: "", pointName: "", pointDescription: "" },
        },
      ],
    },
  ]);

  const [editTour, { isLoading: addLoad }] = useEditTourByIdMutation();
  const { user } = useSelector((state) => state.auth);

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
  }, [isLoadService]);

  const handleSubmit = async () => {
    const values = {
      ...tourData,
      // program: [...addedServices],
      token: user.token,
      comforts: comfortsData.map(({ value }) => value),
      food: foodData.map(({ _id }) => _id),
      id,
      token: user.token,
      img: tourData?.img ? tourData?.img : [],
      price: tourData?.price ? tourData?.price : [],
      rooms: tourData?.rooms ? tourData?.rooms : [],
      locationId: tourData?.locationId,
    };
    console.table(values);
    await editTour(values);

    // if (!addLoad) {
    //   alert("Added");
    // }
  };

  const fileRef = React.useRef(null);

  const handleUpload = async (e) => {
    const formData = new FormData();
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    const values = {
      id,
      name: "tour",
      formData,
    };
    await uploadImage(values)
      .then((response) => console.log(response))
      .finally((fileRef.current = null))
      .catch((err) => console.error(err));
  };

  const [sources, setSources] = useState([]);
  useEffect(() => {
    setSources(tourData.img ? tourData.img : []);
  }, [tourData]);

  console.log(sources);

  return (
    <>
      <AdminHead text="Создание 1-3 тура" onClick={() => handleSubmit()} />
      <div className="add_hotel-page page">
        <Section
          section="add_gen-section"
          wrapper="ass_gen-wrapper shadowed_box"
        >
          <GalleryBox sources={sources} />
          <div className="gen_content-box">
            <div className="gen_title">Основное о туре</div>
            <div className="input_row">
              <Input
                placeholder="Название"
                value={tourData && tourData.name && tourData.name}
                onChange={(e) =>
                  setTourData({ ...tourData, name: e.target.value })
                }
              />
              <Input
                placeholder="Особенность местоположения"
                value={
                  tourData &&
                  tourData.locationFeature &&
                  tourData.locationFeature
                }
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
                value={tourData && tourData.locationId && tourData.locationId}
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
                  <option
                    value={location._id}
                    // selected={
                    //   tourIdData &&
                    //   tourIdData.locationId &&
                    //   tourIdData.locationId._id &&
                    //   location._id === tourIdData.locationId._id
                    // }
                    key={location._id}
                  >
                    {location.locationName}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Город вылета"
                value={
                  tourData && tourData.departureCity && tourData.departureCity
                }
                onChange={(e) =>
                  setTourData({
                    ...tourData,
                    departureCity: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Ссылка на карту"
                value={tourData && tourData.mapLink && tourData.mapLink}
                onChange={(e) =>
                  setTourData({
                    ...tourData,
                    mapLink: e.target.value,
                  })
                }
              />
            </div>
            <div className="input_row">
              <Input
                placeholder="Рейтинг тура"
                value={tourData && tourData.rating && tourData.rating}
                type="number"
                onChange={(e) =>
                  setTourData({
                    ...tourData,
                    rating: e.target.value,
                  })
                }
              />
              <select
                className="primary-input"
                type="number"
                placeholder="Продолжительность тура"
                onChange={(e) =>
                  setTourData({
                    ...tourData,
                    duration: e.target.value,
                  })
                }
              >
                <option
                  // selected={
                  //   tourIdData && 1 === Number(tourIdData.duration)
                  // }
                  value={1}
                >
                  1 день
                </option>
                <option
                  // selected={
                  //   tourIdData && 2 === Number(tourIdData.duration)
                  // }
                  value={2}
                >
                  2 дня
                </option>
                <option
                  // selected={
                  //   tourIdData && 3 === Number(tourIdData.duration)
                  // }
                  value={3}
                >
                  3 дня
                </option>
              </select>
            </div>
            <div className="input_row">
              <textarea
                className="primary-input"
                cols="30"
                rows="5"
                value={tourData && tourData.description && tourData.description}
                placeholder="Описание"
                onChange={(e) =>
                  setTourData({
                    ...tourData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <input
              onChange={handleUpload}
              type="file"
              hidden
              ref={fileRef}
              multiple
            />
            <button
              className={`primary-btn`}
              onClick={() => fileRef.current.click()}
            >
              Изменить фото
            </button>
          </div>
        </Section>
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
                          <option
                            selected={
                              tourData.hotelId &&
                              hotel._id === tourData.hotelId._id
                            }
                            value={hotel._id}
                            key={hotel._id}
                          >
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
                    value={foodData}
                    placeholder={`Введите значение`}
                    onChange={setFoodData}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                      }),
                    }}
                  />

                  <div className="input_title">Удобства</div>

                  <Selector2
                    data={allServices}
                    placeholder={`Введите значение`}
                    value={comfortsData}
                    onChange={setComfortsData}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                      }),
                    }}
                  />
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
                      <option
                        // selected={
                        //   tourIdData &&
                        //   tourIdData.kids &&
                        //   tourIdData.kids.withKids &&
                        //   false === tourIdData.kids.withKids
                        // }
                        value={false}
                      >
                        Можно с детьми
                      </option>
                      <option
                        // selected={
                        //   tourIdData &&
                        //   tourIdData.kids &&
                        //   tourIdData.kids.withKids &&
                        //   true === tourIdData.kids.withKids
                        // }
                        value={true}
                      >
                        Без детей
                      </option>
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
                {tourData.program &&
                  tourData.program.map((serv, idx) => (
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
                          <div className="input_title">
                            Пункт {pointIdx + 1}
                          </div>
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
                            {/* {console.log(points.points.pointName)} */}
                            <Input
                              placeholder="Название пункта"
                              value={
                                serv.days[pointIdx] &&
                                serv.days[pointIdx].points &&
                                serv.days[pointIdx].points.pointName
                              }
                              onChange={(e) => {
                                setTourData((prev) => ({
                                  ...prev,
                                  program: [
                                    ...prev.program.map((d, id) => {
                                      if (id === idx) {
                                        return {
                                          ...d,

                                          days: [
                                            ...d.days.map((p, pIdx) => {
                                              if (pIdx === pointIdx) {
                                                return {
                                                  ...p,
                                                  points: {
                                                    ...p.points,
                                                    pointName: e.target.value,
                                                  },
                                                };
                                              }
                                              return p;
                                            }),
                                          ],
                                        };
                                      }
                                      return d;
                                    }),
                                  ],
                                }));
                              }}
                            />
                          </div>
                          <div className="input_row">
                            <textarea
                              className="primary-input"
                              cols="30"
                              rows="5"
                              value={
                                serv.days[pointIdx] &&
                                serv.days[pointIdx].points &&
                                serv.days[pointIdx].points.pointDescription
                              }
                              placeholder="Описание"
                              onChange={(e) => {
                                setTourData((prev) => ({
                                  ...prev,
                                  program: [
                                    ...prev.program.map((d, id) => {
                                      if (id === idx) {
                                        return {
                                          ...d,

                                          days: [
                                            ...d.days.map((p, pIdx) => {
                                              if (pIdx === pointIdx) {
                                                return {
                                                  ...p,
                                                  points: {
                                                    ...p.points,
                                                    pointDescription:
                                                      e.target.value,
                                                  },
                                                };
                                              }
                                              return p;
                                            }),
                                          ],
                                        };
                                      }
                                      return d;
                                    }),
                                  ],
                                }));
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
    </>
  );
};

export default EditTour;
