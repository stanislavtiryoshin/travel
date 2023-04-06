import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import addhotel from "../../assets/addhotel.png";

import "./AddRoom.scss";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, updateRoom } from "../../features/room/roomSlice";
import { AdminHead } from "../../components/Admin";
import Section from "../../components/Section";

const AddRoom = ({ fetchedRoomData, editMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const [roomData, setRoomData] = useState({
    hotel: hotelId,
    roomName: "",
    roomType: "",
    capacity: null,
    extraPlace: null,
    roomPrice: null,
    area: null,
    smokingPolicy: "",
    roomsNumber: null,
    beds: {
      bedsType: "",
      largeBeds: null,
      smallBeds: null,
    },
    people: {
      adultMax: null,
      babyMax: null,
      kidsMax: null,
    },
    restroom: "",
    bathroom: {
      availablity: "",
      type: "",
      features: [],
    },
    comforts: [],
    comment: "",
    prices: [],
    roomDescription: "",
    roomServices: [],
    roomDescription: "",
    bathExtras: "",
    periodPrices: [],
  });

  useEffect(() => {
    let newData = fetchedRoomData;
    if (fetchedRoomData && editMode) setRoomData(newData);
  }, [fetchedRoomData, editMode]);

  // const [allCategories, setAllCategories] = useState([]);
  // const [allServices, setAllServices] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3000/api/categories`)
  //     .then((response) => {
  //       setAllCategories(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   axios
  //     .get(`http://localhost:3000/api/roomServices`)
  //     .then((response) => {
  //       setAllServices(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const roomServiceOpts = [
    {
      value: "Кондиционер",
      label: "Кондиционер",
    },
    {
      value: "Кондиционер2",
      label: "Кондиционер3",
    },
    {
      value: "Кондиционер3",
      label: "Кондиционер3",
    },
    {
      value: "Кондиционер4",
      label: "Кондиционер4",
    },
    {
      value: "Кондиционер5",
      label: "Кондиционер5",
    },
    {
      value: "Кондиционер6",
      label: "Кондиционер6",
    },
  ];

  const extraOpts = [
    {
      value: "Полотенца",
      label: "Полотенца",
    },
    {
      value: "Полотенца2",
      label: "Полотенца2",
    },
    {
      value: "Полотенца3",
      label: "Полотенца3",
    },
  ];

  const [options, setOptions] = useState([]);
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    let roomServices = [];
    // let bathExtras = []
    // extras.forEach(extr => bathExtras.push(extr.value))
    options.forEach((serv) => roomServices.push(serv.value));
    setRoomData({ ...roomData, roomServices: roomServices });
  }, [options]);

  useEffect(() => {
    let bathExtras = [];
    extras.forEach((extr) => bathExtras.push(extr.value));
    setRoomData({ ...roomData, bathExtras: bathExtras });
  }, [extras]);

  const handleSubmit = () => {
    editMode
      ? dispatch(updateRoom(roomData))
      : dispatch(addRoom(roomData)).then((res) =>
          navigate(`/dashboard/room/${res.payload._id}`)
        );
  };

  const [servicesToRender, setServicesToRender] = useState([]);

  useEffect(() => {
    let services = [];
    if (roomData.roomServices.length > 0)
      roomData.roomServices.forEach((tag) =>
        services.push({ value: tag, label: tag })
      );
    setServicesToRender(services);
  }, [roomData.roomServices]);

  const [periods, setPeriods] = useState([]);
  const [newPeriods, setNewPeriods] = useState([]);

  useEffect(() => {
    if (fetchedRoomData?.hotel?.periods)
      setPeriods(fetchedRoomData.hotel.periods);
  }, [fetchedRoomData]);

  useEffect(() => {
    setNewPeriods(
      periods.map((per) => {
        return { ...per, periodId: per._id, roomPrice: 0 };
      })
    );
  }, [periods]);

  useEffect(() => {
    setRoomData({ ...roomData, periodPrices: newPeriods });
  }, [newPeriods]);

  console.log(roomData.hotel);

  return (
    <>
      <AdminHead
        text={editMode ? "Редактирование номера" : "Создание нового номера"}
        onClick={() => handleSubmit()}
      />
      <div className="add_hotel-page page">
        <Section
          section="add_gen-section"
          wrapper="add_gen-wrapper shadowed_box"
        >
          <div className="gen_img-box">
            <img src={addhotel} alt="" />
          </div>
          <div className="gen_content-box">
            <div className="gen_title">Основное о номере</div>
            <div className="input_row">
              <div className="service-input full">
                <label htmlFor="roomName">Название</label>
                <input
                  type="text"
                  className="primary-input"
                  name="roomName"
                  placeholder="Например, 4-х местный люкс"
                  value={roomData.roomName}
                  onChange={(e) =>
                    setRoomData({ ...roomData, roomName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="input_row">
              <div className="service-input w-30">
                <label htmlFor="roomsNumber">Количество комнат</label>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.roomsNumber}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      roomsNumber: e.target.value,
                    })
                  }
                >
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="service-input w-30">
                <label htmlFor="roomsNumber">Тип кровати</label>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.beds.bedsType}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      beds: { ...roomData.beds, bedsType: e.target.value },
                    })
                  }
                >
                  <option value="двуспальные">двуспальные</option>
                  <option value="односпальные">односпальные</option>
                  <option value="двуспальные и односпальные">
                    двуспальные и односпальные
                  </option>
                  <option value="двухъярусные">двухъярусные</option>
                  <option value="двуспальные и двухъярусные">
                    двуспальные и двухъярусные
                  </option>
                  <option value="односпальная и двухъярусные">
                    односпальная и двухъярусные
                  </option>
                </select>
              </div>
              <div className="service-input w-20">
                <label htmlFor="roomsNumber">Больших</label>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.beds.largeBeds}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      beds: { ...roomData.beds, largeBeds: e.target.value },
                    })
                  }
                >
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="service-input w-20">
                <label htmlFor="roomsNumber">Односп.</label>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.beds.smallBeds}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      beds: { ...roomData.beds, smallBeds: e.target.value },
                    })
                  }
                >
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
            </div>
            <div className="input_row">
              <div className="service-input w-40">
                <input
                  type="number"
                  className="primary-input"
                  placeholder="Размер номера в кв. метрах"
                  value={roomData.area}
                  onChange={(e) =>
                    setRoomData({ ...roomData, area: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="input_row">
              <div className="service-input">
                <select
                  name="roomsNumber"
                  className="primary-input"
                  placeholder="Макс. кол-во взрослых"
                  value={roomData.people.adultMax}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      people: {
                        ...roomData.people,
                        adultMax: e.target.value,
                      },
                    })
                  }
                >
                  <option selected disabled value="">
                    Макс. кол-во взрослых
                  </option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="service-input">
                <select
                  name="roomsNumber"
                  className="primary-input"
                  placeholder="Макс. кол-во взрослых"
                  value={roomData.people.babyMax}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      people: {
                        ...roomData.people,
                        babyMax: e.target.value,
                      },
                    })
                  }
                >
                  <option selected disabled value="">
                    Макс. кол-во младенцев
                  </option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="service-input">
                <select
                  name="roomsNumber"
                  className="primary-input"
                  placeholder="Макс. кол-во взрослых"
                  value={roomData.people.kidsMax}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      people: {
                        ...roomData.people,
                        kidsMax: e.target.value,
                      },
                    })
                  }
                >
                  <option selected disabled value="">
                    Макс. кол-во детей
                  </option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
            </div>
            <div className="input_row">
              <div className="service-input w-30">
                <div className="service-title">Дополнительные места</div>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.extraPlace}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      extraPlace: e.target.value,
                    })
                  }
                >
                  <option value="" selected disabled>
                    Макс. кол-во в номере
                  </option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="service-input w-30">
                <div className="service-title">Политика курения</div>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.smokingPolicy}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      smokingPolicy: e.target.value,
                    })
                  }
                >
                  <option value="Для НЕкурящих" selected>
                    Для НЕкурящих
                  </option>
                  <option value="Для курящих">Для курящих</option>
                </select>
              </div>
              <div className="service-input w-20">
                <div className="service-title">Санузел</div>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.restroom}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      restroom: e.target.value,
                    })
                  }
                >
                  <option value="Есть" selected>
                    Есть
                  </option>
                  <option value="Нет">Нет</option>
                </select>
              </div>
              <div className="service-input w-20">
                <div className="service-title">Ванная</div>
                <select
                  name="roomsNumber"
                  className="primary-input"
                  value={roomData.bathroom.availablity}
                  onChange={(e) =>
                    setRoomData({
                      ...roomData,
                      bathroom: {
                        ...roomData.bathroom,
                        availablity: e.target.value,
                      },
                    })
                  }
                >
                  <option value="Есть" selected>
                    Есть
                  </option>
                  <option value="Нет">Нет</option>
                </select>
              </div>
            </div>
            <div className="input_row">
              <textarea
                className="primary-input"
                name=""
                id=""
                cols="30"
                rows="5"
                placeholder="Описание"
                value={roomData.roomDescription}
                onChange={(e) =>
                  setRoomData({
                    ...roomData,
                    roomDescription: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
        </Section>
        <Section section="test_section" wrapper="test_wrapper">
          {newPeriods && newPeriods.length > 0
            ? newPeriods?.map((period, idx) => {
                return (
                  <div className="period-box">
                    <div className="period-title">{period._id}</div>
                    <input
                      type="number"
                      name=""
                      id=""
                      style={{ backgroundColor: "lightgrey" }}
                      onChange={(e) => {
                        newPeriods[idx].roomPrice = e.target.value;
                        setRoomData({
                          ...roomData,
                          periodPrices: newPeriods,
                        });
                      }}
                    />
                  </div>
                );
              })
            : null}
        </Section>
        <Section section="add_more-section" wrapper="add_more-wrapper">
          <div className="add_more-col more-col shadowed_box">
            <div className="gen_title">Подробнее</div>
            <div className="input_box">
              <div className="input_row">
                <div className="service-input full">
                  <label htmlFor="service">Удобства</label>
                  {!editMode ? (
                    <Select
                      options={roomServiceOpts}
                      placeholder="Введите значение"
                      value={options}
                      onChange={(option) => {
                        setOptions(option);
                      }}
                      isSearchable={true}
                      isMulti
                      useDragHandle
                      axis="xy"
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          width: `${550}px`,
                          border: "none",
                          "background-color": "rgb(249, 249, 249)",
                          outline: "none",
                        }),
                      }}
                    />
                  ) : (
                    <Select
                      options={roomServiceOpts}
                      placeholder="Введите значение"
                      value={servicesToRender}
                      onChange={(option) => {
                        setOptions(option);
                      }}
                      isSearchable={true}
                      isMulti
                      useDragHandle
                      axis="xy"
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          width: `${550}px`,
                          border: "none",
                          "background-color": "rgb(249, 249, 249)",
                          outline: "none",
                        }),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="input_box">
              <div className="input_row">
                <div className="service-input">
                  <div className="service-title">Содержимое ванной</div>
                  <label htmlFor="">Ванна или душ</label>
                  <select
                    name=""
                    id=""
                    className="primary-input"
                    value={roomData.bathroom.type}
                    onChange={(e) => {
                      setRoomData({
                        ...roomData,
                        bathroom: {
                          ...roomData.bathroom,
                          type: e.target.value,
                        },
                      });
                    }}
                  >
                    <option value="Душ">Душ</option>
                    <option value="Ванна">Ванна</option>
                  </select>
                </div>
              </div>
              <div className="input_row">
                <div className="service-input">
                  <label htmlFor="">Дополнительное содержимое</label>
                  <Select
                    options={extraOpts}
                    placeholder="Введите значение"
                    value={extras}
                    onChange={(option) => {
                      setExtras(option);
                    }}
                    isSearchable={true}
                    isMulti
                    useDragHandle
                    axis="xy"
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                        border: "none",
                        "background-color": "rgb(249, 249, 249)",
                        outline: "none",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="add_more-col categ-col shadowed_box">
            <div className="gen_title">Примечания</div>
            <div className="input_row">
              <textarea
                className="primary-input"
                name=""
                id=""
                cols="30"
                rows="5"
                placeholder="Примечание"
                value={roomData.comment}
                onChange={(e) =>
                  setRoomData({
                    ...roomData,
                    comment: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default AddRoom;
