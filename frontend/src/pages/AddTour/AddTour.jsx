import React, { useEffect } from "react";
import style from "./AddTour.module.scss";

import { AdminHead } from "../../components/Admin";
import "../AddHotel/AddHotel.scss";
import { AdminAddForm } from "../../components/Admin/AdminAddForm";
import addhotel from "../../assets/addhotel.png";
import { Input } from "../../components/Form";
import Selector from "../AddHotel/Select";
import {
  // useGetCategoryQuery,
  useGetHotelServiceQuery,
  useGetHotelsQuery,
  useGetLocationQuery,
} from "../../features/services/base.service";

const food = [
  { label: "Без питания", value: "Без питания" },
  { label: "3х дневное", value: "3х дневное" },
];

const AddTour = () => {
  const [tourData, setTourData] = React.useState({
    tourProgram: { programId: "64258af02ba7928f871a09cd" },
    locationId: null,
    name: "",
    locationFeature: "",
    departureCity: "",
    mapLink: "",
    rating: null,
    ratingVotes: 0,
    description: "",
    duration: "",
    days: [],
    food: null,
    kidFoodPrice: null,
    adultFoodPrice: null,
    comforts: [],
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
  const { data: hotels = [], isLoading: isHotelLoaded } = useGetHotelsQuery();
  const { data: allLocations = [], isLoading } = useGetLocationQuery();
  // const { data: categories = [] } = useGetCategoryQuery();
  const { data: service, isLoading: isLoadService } = useGetHotelServiceQuery();

  const [allServices, setAllServices] = React.useState([]);
  const [withKid, setWithKid] = React.useState(false);

  const [addedServices, setAddedServices] = React.useState([{}]);

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

  return (
    <>
      <AdminHead text="Создание 1-3 тура" onClick={() => {}} />
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
                        setTourData({ ...tourData, locationId });
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

                  <select className="primary-input">
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

                  <Selector
                    optionList={food}
                    placeholder={`Введите значение`}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: `${550}px`,
                      }),
                    }}
                  />

                  <div className="input_title">Удобства</div>
                  <Selector
                    optionList={allServices}
                    placeholder={`Введите значение`}
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
                      }}
                    >
                      <option value={false} selected>
                        Можно с детьми
                      </option>
                      <option value={true}>Без детей</option>
                    </select>

                    <select disabled={withKid} className="primary-input">
                      <option value="" disabled selected>
                        Мин. возр.
                      </option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    <select disabled={withKid} className="primary-input">
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
                {addedServices?.map((serv, idx) => (
                  <div className="input_box">
                    <div className={style.days}>День {idx + 1}</div>
                    <div className="input_title">Пункт 1</div>
                    <div className="input_row">
                      <select
                        className="primary-input"
                        onChange={(e) => {
                          setTourData({ ...tourData });
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
                      <Input placeholder="Название пункта" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AddTour;
