import React from "react";

const RowInput = ({ onChange, value }) => {
  const formatter = Intl.NumberFormat("ru-RU");
  let newValue = formatter.format(value);
  return (
    <input
      onFocus={(e) => e.target.select()}
      type="number"
      value={value}
      onChange={onChange}
      onWheel={(e) => e.target.blur()}
    />
  );
};

export default RowInput;
