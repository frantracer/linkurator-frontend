import { useState, useEffect } from "react";

export enum InputType {
  TEXT = "text",
  PASSWORD = "password"
}

type InputTextProps = {
  placeholder?: string;
  withLeftPadding?: boolean;
  onChange?: (value: string) => void;
  onClick?: () => void;
  value?: string;
  disabled?: boolean;
  inputType?: InputType;
  autofocus?: boolean;
};

const InputText = (
  {
    placeholder = "Input",
    withLeftPadding = false,
    onChange = undefined,
    onClick = undefined,
    value = "",
    disabled = false,
    inputType = InputType.TEXT,
    autofocus = false,
  }: InputTextProps) => {
  const [searchValue, setSearchValue] = useState(value);

  let padding = "";
  if (withLeftPadding) {
    padding = "pl-10";
  }

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  return (
    <input
      className={"input input-sm input-bordered input-primary w-full " + padding}
      type={inputType?.toString()}
      placeholder={placeholder}
      value={searchValue}
      disabled={disabled}
      autoFocus={autofocus}
      onChange={(e) => {
        setSearchValue(e.target.value);
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      onClick={onClick}
    />
  );
}

export default InputText;
