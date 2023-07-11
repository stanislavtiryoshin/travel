import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { addHotel, updateHotel } from "../../features/hotel/hotelSlice";

import "./AddHotel.scss";
import "./Table.scss";
import { useDispatch, useSelector } from "react-redux";
import { AdminHead } from "../../components/Admin";
import Section from "../../components/Section";
import ServiceCard from "./ServiceCard";

import { useUploadImageMutation } from "../../features/services/upload.service";
import GalleryBox from "../../components/Slider/GalleryBox";
import { setCurrServices } from "../../features/adminSlice";
import Periods from "./Periods";

import hotelmain from "../../assets/hotel/hotelmain.png";
import secondary from "../../assets/camp/campsecondary.png";
import NewServiceModal from "./NewServiceModal";
import PriceTable from "./PriceTable";

import { enterTimes } from "./values/enterTimes";
import { paymentPercents } from "./values/paymentPercents";
import { babyAges } from "./values/babyAges";
import { hotelStars } from "./values/hotelStars";
import { kidAges } from "./values/kidAges";
import useHotelData from "../../hooks/addData/useHotelData";
import { useFetchedData } from "../../hooks/fetchedData/useFetchedData";
import LabeledInput from "../../components/Inputs/LabeledInput";
import LocationSelect from "../../components/Inputs/LocationSelect";
import { useGetServicesQuery } from "../../features/services/base.service";
import HotelServices from "./components/HotelServices";

const AddHotel = ({
  fetchedHotelData,
  editMode,
  updateHotelData,
  handleUploadImage,
}) => {
  const [hotelData, setHotelData] = useHotelData();

  const imageRef = useRef(null);

  const { currServices } = useSelector((state) => state.admin);

  const [fetchedOptions, setFetchedOptions] = useState([]);

  useEffect(() => {
    if (
      fetchedHotelData?.hotelServices &&
      fetchedHotelData?.hotelServices.length > 0
    ) {
      setFetchedOptions(fetchedHotelData?.hotelServices);
    }
  }, [fetchedHotelData]);

  useEffect(() => {
    let newData = fetchedHotelData;
    setHotelData(newData);
  }, [fetchedHotelData, editMode]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [upload, { data: uploadedImage, isLoading: uploadIsLoading }] =
    useUploadImageMutation();

  // const [isOpen, setIsOpen] = useState(false);

  // Fetching all categories, services, locations, foods
  const { allServices, allFoods, allCategories, allLocations } =
    useFetchedData();

  // comforts: [...JSON.parse(localStorage.getItem("comforts"))],

  const handleSubmit = () => {
    // const values = {
    //   ...hotelData,
    //   comforts: [...JSON.parse(localStorage.getItem("comforts"))],
    // };

    // console.log(values);

    dispatch(addHotel({ ...hotelData, hotelServices: currServices })).then(
      (res) => {
        navigate(`/dashboard/hotel/${res.payload._id}`);
      }
    );
  };

  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    if (hotelData?.periods && hotelData?.periods?.length > 0) {
      setPeriods(hotelData?.periods);
    }
  }, [hotelData]);

  const [newService, setNewService] = useState({
    hotelServiceName: null,
    category: null,
  });

  const [sources, setSources] = useState([]);
  useEffect(() => {
    setSources(hotelData?.img ? hotelData?.img : []);
  }, [hotelData]);

  const [searchable, setIsSearchable] = useState(true);

  const clickUpload = () => imageRef.current.click();

  return (
    <>
      <AdminHead
        text={!editMode ? "Создание нового отеля" : "Редактирование отеля"}
        onClick={() => {
          !editMode
            ? handleSubmit()
            : dispatch(
                updateHotel({
                  ...hotelData,
                  hotelServices: currServices,
                  searchable,
                })
              ).then(() => navigate("/dashboard/hotels"));
        }}
        headBack={() => {
          navigate(-1);
        }}
      />
      <div className="add_hotel-page">
        <Section
          section="add_gen-section"
          wrapper="add_gen-wrapper wrapper shadowed_box"
        >
          <GalleryBox
            handleUploadImage={clickUpload}
            sources={
              sources.length > 0
                ? sources
                : [hotelmain, secondary, secondary, secondary, secondary]
            }
          />
          <div className="gen_content-box">
            <div className="gen_title_checkbox">
              <div className="gen_title">Основное об отеле</div>

              {editMode && (
                <div
                  className="toggler-box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      marginRight: "5px",
                      fontWeight: "500",
                      width: "fit-content",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Отображать при поиске
                  </div>
                  <label class="switch">
                    <input
                      type="checkbox"
                      checked={searchable}
                      onChange={() => setIsSearchable(!searchable)}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              )}
            </div>

            <div className="input_row">
              <LabeledInput
                inputType="text"
                label="Название"
                value={hotelData && hotelData?.name}
                placeholder="Название"
                onChange={(e) =>
                  setHotelData({ ...hotelData, name: e.target.value })
                }
              />
              <LabeledInput
                inputType="text"
                label="Особенность местоположения"
                placeholder="Особенность местоположения"
                value={hotelData && hotelData?.locationFeature}
                onChange={(e) =>
                  setHotelData({
                    ...hotelData,
                    locationFeature: e.target.value,
                  })
                }
              />
            </div>
            <div className="input_row">
              <LocationSelect />
              <LabeledInput
                label="Ссылка на карту"
                inputType="text"
                value={hotelData?.mapLink}
                placeholder="Ссылка на карту"
                onChange={(e) =>
                  setHotelData({ ...hotelData, mapLink: e.target.value })
                }
              />
            </div>
            <div className="input_row">
              <LabeledInput
                inputType="number"
                label="Рейтинг отеля"
                value={hotelData?.rating}
                placeholder="Рейтинг отеля"
                onChange={(e) =>
                  setHotelData({ ...hotelData, rating: e.target.value })
                }
              />
              <LabeledInput
                label="Звёзды отеля"
                selectMode
                placeholder="Местоположение"
                value={hotelData?.hotelStars}
                onChange={(e) => {
                  setHotelData({
                    ...hotelData,
                    hotelStars: e.target.value,
                  });
                }}
              >
                {hotelStars.map((el) => (
                  <option value={el}>{el}</option>
                ))}
              </LabeledInput>
            </div>
            <div className="input_row">
              <textarea
                className="primary-input"
                cols="30"
                rows="15"
                style={{ height: "100%" }}
                value={hotelData?.description}
                placeholder="Описание"
                onChange={(e) =>
                  setHotelData({
                    ...hotelData,
                    description: e.target.value,
                  })
                }
              ></textarea>
              <input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleUploadImage}
                multiple
              />
              {/* {editMode && (
                <>
                  
                  <button
                    onClick={() => imageRef.current.click()}
                    className={`primary-btn`}
                  >
                    Изменить фото
                  </button>
                </>
              )} */}
            </div>
          </div>
        </Section>

        <Section section="add_more-section" wrapper="add_more-wrapper">
          <div className="add_more-col more-col shadowed_box">
            <div className="gen_title">Подробнее</div>
            <div className="input_box">
              <div className="input_title">Время заезда</div>
              <div className="input_row">
                <div className="service-input">
                  <label htmlFor="discountType">Время заезда</label>
                  <select
                    name=""
                    id=""
                    className="primary-input"
                    value={hotelData?.enterTime}
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
                    {enterTimes.map((el) => (
                      <option key={el} value={el}>
                        {el}
                      </option>
                    ))}
                  </select>
                </div>
                <LabeledInput
                  label="Время выезда"
                  selectMode
                  value={hotelData?.leaveTime}
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
                  {enterTimes.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </LabeledInput>
              </div>
            </div>
            <div className="input_box">
              <div className="input_title">Дети</div>
              <div className="input_row">
                <select
                  name="babyMaxAge"
                  id=""
                  className="primary-input"
                  value={hotelData?.kids?.babyMaxAge}
                  onChange={(e) =>
                    setHotelData({
                      ...hotelData,
                      kids: {
                        ...hotelData?.kids,
                        babyMaxAge: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled selected>
                    Макс. возр. млад.
                  </option>
                  {babyAges.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
                <select
                  name="kidMaxAge"
                  id=""
                  className="primary-input"
                  value={hotelData?.kids?.kidMaxAge}
                  onChange={(e) =>
                    setHotelData({
                      ...hotelData,
                      kids: {
                        ...hotelData?.kids,
                        kidMaxAge: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled selected>
                    Макс. возр. реб.
                  </option>
                  {kidAges.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input_row">
                <div className="service-input">
                  <label htmlFor="discountType">Тип скидки для ребенка</label>

                  <select
                    name="discountType"
                    id=""
                    className="primary-input"
                    value={hotelData?.kids?.kidDiscount?.discountType}
                    onChange={(e) =>
                      setHotelData({
                        ...hotelData,
                        kids: {
                          ...hotelData?.kids,
                          kidDiscount: {
                            ...hotelData?.kids.kidDiscount,
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
                    onWheel={(e) => e.target.blur()}
                    name="discount"
                    className="primary-input"
                    placeholder="2000"
                    value={hotelData?.kids?.kidDiscount?.discountValue}
                    onChange={(e) =>
                      setHotelData({
                        ...hotelData,
                        kids: {
                          ...hotelData?.kids,
                          kidDiscount: {
                            ...hotelData?.kids.kidDiscount,
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
              {allFoods ? (
                <select
                  name="foodType"
                  id=""
                  className="primary-input"
                  value={hotelData?.food?._id}
                  onChange={(e) =>
                    setHotelData({ ...hotelData, food: e.target.value })
                  }
                >
                  {allFoods?.length > 0
                    ? allFoods?.map((food) => {
                        return (
                          <option value={food?._id} key={food?._id}>
                            {food?.label}
                          </option>
                        );
                      })
                    : null}
                </select>
              ) : null}
              <div className="input_row">
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  className="primary-input"
                  name="adultFoodPrice"
                  placeholder="Цена за питание взрослого"
                  value={hotelData?.adultFoodPrice}
                  onChange={(e) => {
                    setHotelData({
                      ...hotelData,
                      adultFoodPrice: e.target.value,
                    });
                  }}
                />
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="kidFoodPrice"
                  className="primary-input"
                  placeholder="Цена за детское питание"
                  value={hotelData?.kidFoodPrice}
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
              <div className="input_title">Маржа</div>
              <input
                type="number"
                className="primary-input"
                placeholder="10%"
                value={hotelData?.marge}
                onChange={(e) => {
                  setHotelData((prev) => ({
                    ...prev,
                    marge: e.target.value,
                  }));
                }}
              />
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
                    value={hotelData?.payment?.paymentType}
                    onChange={(e) => {
                      setHotelData({
                        ...hotelData,
                        payment: {
                          ...hotelData?.payment,
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
                    value={hotelData?.payment?.prepayment}
                    onChange={(e) => {
                      setHotelData({
                        ...hotelData,
                        payment: {
                          ...hotelData?.payment,
                          prepayment: e.target.value,
                        },
                      });
                    }}
                  >
                    {paymentPercents.map((el) => (
                      <option key={el.value} value={el.value}>
                        {el.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <HotelServices
            allServices={allServices}
            // setIsOpen={setIsOpen}
            fetchedOptions={fetchedOptions}
          />
        </Section>

        {editMode ? (
          <>
            <Periods
              periods={periods}
              setPeriods={setPeriods}
              updateHotelData={updateHotelData}
              hotelId={hotelData?._id}
              mode="hotel"
            />
            <PriceTable
              fetchedHotelData={fetchedHotelData}
              hotelData={hotelData}
            />
          </>
        ) : null}
      </div>

      {/* <NewServiceModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        newService={newService}
        setNewService={setNewService}
        allCategories={allCategories}
      /> */}
    </>
  );
};

export default AddHotel;
