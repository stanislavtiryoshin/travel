import React, { useState, useEffect } from "react";

import Select from "react-select";

export default function Selector2({
  styles,
  placeholder,
  onChange,
  data,
  value,
}) {
  return (
    <div className="service-input full">
      <Select
        options={data}
        placeholder={placeholder && placeholder}
        value={value}
        onChange={(option) => {
          onChange(option);
        }}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            width: `${550}px`,
            border: "none",
            "background-color": "rgb(249, 249, 249)",
            outline: "none",
          }),
        }}
        isSearchable={true}
        isMulti
        useDragHandle
        axis="xy"
      />
    </div>
  );
}
