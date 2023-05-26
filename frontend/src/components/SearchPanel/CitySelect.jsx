import React from "react";
import Select from "react-select";
import { setSearchData } from "../../features/search/searchSlice";
import { useGetLocationQuery } from "../../features/services/base.service";
import { useDispatch, useSelector } from "react-redux";

const CitySelect = () => {
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
      background: "#fff",
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
    <Select
      onChange={handleSelect}
      className="basic-single"
      classNamePrefix="select"
      defaultValue={{ label: "Весь Казахстан", value: "" }}
      isSearchable={true}
      name="color"
      options={[{ label: "Весь Казахстан", value: "" }, ...locationOptions]}
      styles={customStyles}
    />
    // <select
    //   type="text"
    //   placeholder="Астана"
    //   name="destination"
    //   value={searchData.locationId}
    //   onChange={(e) => {
    //     dispatch(
    //       setSearchData({
    //         ...searchData,
    //         locationId: e.target.value,
    //         locationName: allLocations.find((loc) => loc._id === e.target.value)
    //           ?.locationName
    //           ? allLocations.find((loc) => loc._id === e.target.value)
    //               ?.locationName
    //           : "Весь Казахстан",
    //       })
    //     );
    //   }}
    // >
    //   <option value="" selected>
    //     Весь Казахстан
    //   </option>
    //   {allLocations ? (
    //     allLocations.map((location, idx) => {
    //       return (
    //         <option value={location._id} key={location._id}>
    //           {location.locationName}
    //         </option>
    //       );
    //     })
    //   ) : (
    //     <p>Locations are loading</p>
    //   )}
    // </select>
  );
};

export default CitySelect;
