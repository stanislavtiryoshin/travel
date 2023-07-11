import React from "react";
import Select from "react-select";
import { setSearchData } from "../../features/search/searchSlice";
import { useGetLocationQuery } from "../../features/services/base.service";
import { useDispatch, useSelector } from "react-redux";

import "./Inputs.scss";

const LocationSelect = () => {
  const dispatch = useDispatch();

  // Importing all locations for location select
  const { data: allLocations = [], isLoading } = useGetLocationQuery();
  const locationOptions = allLocations.map((loc) => {
    return {
      label: loc.locationName,
      value: loc._id,
    };
  });

  // Importing searchData from searchSlice
  const { searchData } = useSelector((state) => state.search);

  // Handling select
  const handleSelect = (option) => {
    dispatch(
      setSearchData({
        ...searchData,
        locationId: option.value,
        locationName: option.label,
      })
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "transparent",
      borderColor: "transparent",
      border: "none",
      minHeight: "26px",
      height: "26px",
      boxShadow: state.isFocused ? null : null,
      cursor: "pointer",
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "26px",
      padding: "0 6px 0 0",
      width: "100%",
    }),

    singleValue: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "26px",
      padding: "0 8px",
    }),
  };

  return (
    <div className="service-input loc">
      <label htmlFor="">Локация</label>
      <Select
        onChange={handleSelect}
        placeholder="Выберите местоположение"
        className="locations-input"
        isSearchable={true}
        options={locationOptions}
        styles={customStyles}
      />
    </div>
  );
};

export default LocationSelect;
