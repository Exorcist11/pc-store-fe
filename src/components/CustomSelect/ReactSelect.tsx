"use client";

import React, { useId } from "react";
import Select, { StylesConfig, components } from "react-select";
import { Label } from "../ui/label";

export type OptionsSelect = {
  value: string;
  label: string;
};

interface IReactSelectProps {
  isMulti?: boolean;
  options: OptionsSelect[];
  isRequired?: boolean;
  label?: string;
  name?: string;
  onChange?: (value: any) => void;
  value?: any;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const customStyles: StylesConfig<any, boolean> = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.5rem", // rounded-md
    borderColor: state.isFocused ? "#000" : "#e5e7eb", // focus black / gray-200
    boxShadow: "none",
    minHeight: "40px",
    height: "40px",
    paddingLeft: "8px",
    "&:hover": {
      borderColor: "#000", // hover đậm hơn
    },
    fontSize: "14px",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  placeholder: (base, { selectProps }: any) => ({
    ...base,
    color: "#9ca3af", // text-gray-400
    marginLeft: selectProps.icon ? "28px" : "0px",
    fontSize: "14px",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    fontSize: "14px",
    backgroundColor: isSelected
      ? "#f3f4f6" // bg-gray-100 khi chọn
      : isFocused
      ? "#f9fafb" // hover bg-gray-50
      : "white",
    color: "#111827", // text-gray-900
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // shadow-md
    border: "1px solid #e5e7eb",
    marginTop: "4px",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: "#6b7280", // text-gray-500
    paddingRight: "8px",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

// Custom ValueContainer để đặt icon bên trái
const ValueContainer = ({ children, ...props }: any) => {
  const { selectProps } = props;
  return (
    <components.ValueContainer {...props}>
      <div className="flex items-center gap-2">
        {selectProps.icon && (
          <span className="text-gray-500">{selectProps.icon}</span>
        )}
        {children}
      </div>
    </components.ValueContainer>
  );
};

export default function ReactSelect(props: IReactSelectProps) {
  const {
    isMulti = false,
    options,
    isRequired = false,
    label,
    name,
    onChange,
    value,
    placeholder,
    disabled,
    icon,
  } = props;
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select
        instanceId={id}
        id={id}
        isMulti={isMulti}
        options={options}
        value={value}
        components={{
          ValueContainer,
        }}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        isDisabled={disabled}
        styles={customStyles}
        isClearable
        {...(icon ? { icon } : {})}
      />
    </div>
  );
}
