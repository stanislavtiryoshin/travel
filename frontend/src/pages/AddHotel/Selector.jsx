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
        styles={styles && styles}
        options={data}
        placeholder={placeholder && placeholder}
        value={value}
        onChange={(option) => {
          onChange(option);
        }}
        isSearchable={true}
        isMulti
        useDragHandle
        axis="xy"
      />
    </div>
  );
}
