import React, { useState } from "react";

import Select from "react-select";

export default function Selector({
  allCategories,
  optionList,
  thisCategServices,
}) {
  const [options, setOptions] = useState([]);
  const [currCateg, setCurrCateg] = useState("Питание");

  return (
    <>
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
                  <option value={categ.categoryName} key={categ._id}>
                    {categ.categoryName}
                  </option>
                );
              })
            : null}
        </select>
      </div>
      <div className="service-input full">
        <label htmlFor="service">Услуги и удобства</label>
        <Select
          options={optionList.filter((serv) => serv.category === currCateg)}
          placeholder="Введите значение"
          value={options}
          onChange={(option) => {
            setOptions(option);
          }}
          isSearchable={true}
          isMulti
          useDragHandle
          axis="xy"
        />
      </div>
    </>
  );
}
