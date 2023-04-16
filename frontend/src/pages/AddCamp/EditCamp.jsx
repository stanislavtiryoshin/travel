import React, { useEffect, useState } from "react";
import style from "../AddTour/AddTour.module.scss";

import { AdminHead } from "../../components/Admin";
import "../AddHotel/AddHotel.scss";
import { AdminAddForm } from "../../components/Admin/AdminAddForm";
import addhotel from "../../assets/campPhoto.png";
import { Input } from "../../components/Form";
import Selector from "../AddHotel/Select";
import Selector2 from "../AddHotel/Selector";

import {
  useGetHotelServiceQuery,
  useGetLocationQuery,
  useGetFoodQuery,
} from "../../features/services/base.service";

import {
  useEditCampByIdMutation,
  useGetCampByIdQuery,
  useLazyGetCampByIdQuery,
} from "../../features/services/edit.service";

import { useSelector } from "react-redux";

import { useParams, useNavigate } from "react-router-dom";
import { useUploadImageMutation } from "../../features/services/upload.service";

const EditCamp = () => {
  const [foodData, setFoodData] = useState([]);
  const [comforts, setComforts] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams("id");
  // const {
  //   data: campById = [],
  //   isLoading: byIdLoaded,
  //   isSuccess,
  // } = useGetCampByIdQuery(id);

  const [campData, setCampByData] = useState([]);
  const [fetchCampById, { isLoading: byIdLoaded }] = useLazyGetCampByIdQuery();

  // const [campData, setCampData] = React.useState({});
  useEffect(() => {
    fetchCampById(id)
      .then(({ data }) => setCampByData(data))
      .catch((err) => console.error(err));
  }, []);

  const [upload, { isLoading: imageIsLoading }] = useUploadImageMutation();

  const { data: food = [], isLoading: isLoadFood } = useGetFoodQuery();
  const { data: allLocations = [], isLoading } = useGetLocationQuery();
  const { data: service, isLoading: isLoadService } = useGetHotelServiceQuery();

  const [allServices, setAllServices] = React.useState([]);

  const [addedServices, setAddedServices] = React.useState([
    {
      days: [
        {
          points: { day: null, time: "", pointName: "", pointDescription: "" },
        },
      ],
    },
  ]);

  const [createCamp, { isLoading: addLoad, data: camp }] =
    useEditCampByIdMutation();
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
      id: id,
      ...campData,
      token: user.token,
    };
    console.table(values);
    await createCamp(values);
  };

  const imageRef = React.useRef(null);

  const handleUpload = async (e) => {
    const files = e.target.files;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    const values = {
      id,
      formData,
      name: "camps",
    };

    upload(values)
      .then((response) => console.log(response))
      .then((imageRef.current.value = null))
      .catch((err) => console.error(err));
  };

  if (byIdLoaded && !campData) {
    return <div> Loading...</div>;
  }

  return (
    <>
      <AdminHead text="Создание лагеря" onClick={() => handleSubmit()} />
      <div className="add_hotel-page page">
        <section className="add_gen-section">
          <div className="container">
            <div className="add_gen-wrapper wrapper shadow_box">
              <AdminAddForm img={addhotel}>
                <div className="gen_content-box">
                  <div className="gen_title">Основное о лагере</div>
                  <div className="input_row">
                    <Input
                      placeholder="Название"
                      value={campData && campData.name && campData.name}
                      onChange={(e) =>
                        setCampByData({ ...campData, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Особенность местоположения"
                      value={
                        campData &&
                        campData.locationFeature &&
                        campData.locationFeature
                      }
                      onChange={(e) =>
                        setCampByData({
                          ...campData,
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
                      // value={campData.locationId ? campData.locationId : ""}
                      onChange={(e) => {
                        setCampByData({
                          ...campData,
                          locationId: e.target.value,
                        });
                      }}
                    >
                      {!isLoading ? (
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
                      value={campData && campData.mapLink && campData.mapLink}
                      onChange={(e) =>
                        setCampByData({ ...campData, mapLink: e.target.value })
                      }
                    />
                  </div>
                  <div className="input_row">
                    <Input
                      placeholder="Рейтинг лагеря"
                      value={campData && campData.rating && campData.rating}
                      onChange={(e) =>
                        setCampByData({ ...campData, rating: e.target.value })
                      }
                    />
                  </div>
                  <div className="input_row">
                    <textarea
                      className="primary-input"
                      cols="30"
                      rows="5"
                      placeholder="Описание"
                      value={
                        campData && campData.description && campData.description
                      }
                      onChange={(e) =>
                        setCampByData({
                          ...campData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <input
                    onChange={handleUpload}
                    hidden
                    type="file"
                    ref={imageRef}
                    multiple
                  />
                  <button
                    className={`primary-btn`}
                    onClick={() => imageRef.current.click()}
                  >
                    Изменить фото
                  </button>
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
                  <Input
                    placeholder="Название"
                    value={campData && campData.hotelName}
                    onChange={(e) => {
                      setCampByData((prev) => ({
                        ...prev,
                        hotelName: e.target.value,
                      }));
                    }}
                  />
                  <textarea
                    className="primary-input"
                    cols="30"
                    rows="8"
                    placeholder="Описание"
                    value={campData && campData.hotelDescription}
                    onChange={(e) => {
                      setCampByData((prev) => ({
                        ...prev,
                        hotelDescription: e.target.value,
                      }));
                    }}
                  />
                  {/* <div className="input_title">Тип питания</div> */}
                  {/* <Selector
                      optionList={food}
                      placeholder={`Введите значение`}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          width: `${550}px`,
                        }),
                      }}
                    /> */}
                  {/* <Selector2
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
                    /> */}
                  {/* <div className="input_title">Удобства</div>
                    <Selector2
                      data={allServices}
                      value={comforts}
                      placeholder={`Введите значение`}
                      onChange={setComforts}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          width: `${550}px`,
                        }),
                      }}
                    /> */}
                  {/* <Selector
                      optionList={allServices}
                      placeholder={`Введите значение`}
                      queryOption={campById.comforts.map((c) => {
                        return {
                          label: c,
                          value: c,
                        };
                      })}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          width: `${550}px`,
                        }),
                      }} */}
                  {/* /> */}
                  <div className="input_title">Дети</div>
                  <div className="input_row">
                    <select
                      className="primary-input"
                      onChange={(e) => {
                        setCampByData({
                          ...campData,
                          kids: {
                            ...kids,
                            forWho: e.target.value,
                          },
                        });
                      }}
                    >
                      <option value={"Для детей"}>Для детей</option>
                      <option value={"Для вожатых"}>Для вожатых</option>
                    </select>

                    <select
                      className="primary-input"
                      onChange={(e) => {
                        setCampByData((prev) => ({
                          ...prev,
                          kids: {
                            ...prev.kids,
                            minCountInGroup: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option value="" disabled>
                        Мин. кол-во в группе
                      </option>
                      {new Array(20).fill(1).map((age, idx) => (
                        <>
                          {campData &&
                          campData.kids &&
                          campData.kids.minCountInGroup ? (
                            campData.kids.minCountInGroup === age + idx && (
                              <option
                                value={
                                  campData.kids.minCountInGroup
                                    ? campData.kids.minCountInGroup
                                    : 1
                                }
                                selected
                              >
                                {campData.kids.minCountInGroup
                                  ? campData.kids.minCountInGroup
                                  : 1}
                              </option>
                            )
                          ) : (
                            <></>
                          )}
                          <option value={age + idx}>{age + idx}</option>
                        </>
                      ))}
                    </select>
                    <select
                      className="primary-input"
                      onChange={(e) => {
                        setCampByData((prev) => ({
                          ...prev,
                          kids: {
                            ...prev.kids,
                            maxCountInGroup: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option value="" disabled>
                        Макс. кол-во в группе
                      </option>
                      {new Array(20).fill(1).map((age, idx) => (
                        <>
                          {campData &&
                          campData.kids &&
                          campData.kids.maxCountInGroup ? (
                            campData.kids.maxCountInGroup === age + idx && (
                              <option
                                value={
                                  campData.kids.maxCountInGroup
                                    ? campData.kids.maxCountInGroup
                                    : 1
                                }
                                selected
                              >
                                {campData.kids.maxCountInGroup
                                  ? campData.kids.maxCountInGroup
                                  : 1}
                              </option>
                            )
                          ) : (
                            <></>
                          )}
                          <option value={age + idx}>{age + idx}</option>
                        </>
                      ))}
                    </select>
                  </div>
                  <div className="input_row">
                    <select
                      name=""
                      id=""
                      className="primary-input"
                      onChange={(e) => {
                        setCampByData((prev) => ({
                          ...prev,
                          kids: {
                            ...prev.kids,
                            minAgeInGroup: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option disabled>Мин. возраст</option>
                      {new Array(14).fill(1).map((age, idx) => (
                        <>
                          {campData &&
                            campData.kids &&
                            campData.kids.minAgeInGroup &&
                            campData.kids.minAgeInGroup === age + idx && (
                              <option
                                selected
                                value={campData.kids.minAgeInGroup}
                              >
                                {campData.kids.minAgeInGroup}
                              </option>
                            )}
                          <option value={age + idx}>{age + idx}</option>
                        </>
                      ))}
                    </select>

                    <select
                      name=""
                      id=""
                      className="primary-input"
                      onChange={(e) => {
                        setCampByData((prev) => ({
                          ...prev,
                          kids: {
                            ...prev.kids,
                            maxAgeInGroup: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option selected disabled>
                        Макс. возраст
                      </option>
                      {new Array(14).fill(1).map((age, idx) => (
                        <>
                          {campData &&
                            campData.kids &&
                            campData.kids.maxAgeInGroup &&
                            campData.kids.maxAgeInGroup === age + idx && (
                              <option
                                selected
                                value={campData.kids.maxAgeInGroup}
                              >
                                {campData.kids.maxAgeInGroup}
                              </option>
                            )}
                          <option value={age + idx}>{age + idx}</option>
                        </>
                      ))}
                    </select>
                  </div>
                  <div className="input_title">Оплата</div>
                  <div className="input_row">
                    <select id="payment" className="primary-input">
                      <option value="">Оплата за номер</option>
                      <option value="">Оплата за человека</option>
                    </select>

                    <select id="prepayment" className="primary-input">
                      {new Array(5).fill(10).map((a, idx) => (
                        <option value={a * (idx + 1)}>{a * (idx + 1)}%</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="add_more-col categ-col shadowed_box">
                <div className="gen_title">Программа лагеря</div>
                {campData?.program &&
                  campData?.program.map((serv, idx) => (
                    <div className="input_box">
                      <div className={style.days}>День {idx + 1}</div>
                      {serv.days.map((points, pointIdx) => (
                        <>
                          <div className="input_title">
                            Пункт {pointIdx + 1}
                          </div>
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
                              value={
                                serv.days[pointIdx] &&
                                serv.days[pointIdx].points &&
                                serv.days[pointIdx].points.pointName
                              }
                              onChange={(e) => {
                                setCampByData((prev) => ({
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
                                setCampByData((prev) => ({
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
    </>
  );
};

export default EditCamp;
