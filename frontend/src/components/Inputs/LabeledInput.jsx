import React from "react";

const LabeledInput = ({
  children,
  label,
  inputType,
  value,
  onChange,
  placeholder,
  selectMode,
}) => {
  return (
    <div className="service-input">
      <label htmlFor="">{label}</label>
      {!selectMode ? (
        <input
          type={inputType}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="primary-input"
          onWheel={(e) => e.target.blur()}
        />
      ) : (
        <select
          onWheel={(e) => e.target.blur()}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          className="primary-input"
        >
          {children}
        </select>
      )}
    </div>
  );
};

export default LabeledInput;
